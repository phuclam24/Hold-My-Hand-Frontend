import { authApi } from '@/api'
import { useAuthStore } from '@/stores'
import { notify } from '@/lib/toast'
import type { LoginResponse } from '@/types'

// ─── Singleton state ────────────────────────────────────────────
// Lưu các hàm callback đã đăng ký từ component khi mount,
// để có thể gọi lại khi script GIS vừa load xong (tránh race condition).
type InitCallback = () => void

let pendingInits: InitCallback[] = []
let gisReady = false
let initInFlight = false
let lastClientId: string | null = null

const GIS_SRC = 'https://accounts.google.com/gsi/client'
const SCRIPT_ID = 'google-gis-script'

/** Đảm bảo script GIS đã được inject và load xong, rồi resolve. */
function ensureGisLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('GIS chỉ chạy trên trình duyệt.'))
      return
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      if (gisReady) {
        resolve()
      } else {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener(
          'error',
          () => reject(new Error('Không tải được Google Identity Services.')),
          { once: true },
        )
      }
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = GIS_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      gisReady = true
      resolve()
    }
    script.onerror = () =>
      reject(new Error('Không tải được Google Identity Services.'))
    document.head.appendChild(script)
  })
}

/** Khởi tạo google.accounts.id với callback xử lý idToken. */
async function initGis(clientId: string, onCredential: (idToken: string) => void) {
  await ensureGisLoaded()

  // Nếu clientId đổi (HMR / đổi env), cho phép init lại.
  if (lastClientId && lastClientId !== clientId) {
    initInFlight = false
  }
  lastClientId = clientId

  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity Services không khả dụng.')
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) onCredential(response.credential)
    },
    // Không tự đăng nhập lại user cũ — luôn cho phép chọn tài khoản.
    auto_select: false,
    cancel_on_tap_outside: true,
    // Popup mode: mở cửa sổ nhỏ khi user click nút, không redirect.
    ux_mode: 'popup',
    itp_support: true,
  })
}

/** Đăng ký hàm callback, sẽ được gọi ngay khi GIS ready (hoặc ngay lập tức nếu đã ready). */
export async function registerGoogleAuth(onCredential: (idToken: string) => void) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || clientId.includes('YOUR_GOOGLE')) {
    throw new Error(
      'VITE_GOOGLE_CLIENT_ID chưa được cấu hình. Hãy thêm vào file .env.local và Authorized JavaScript origins trên Google Cloud Console.',
    )
  }

  if (initInFlight) {
    pendingInits.push(() => initGis(clientId, onCredential))
    return
  }
  initInFlight = true
  try {
    await initGis(clientId, onCredential)
    // Drain các pending init khác (ví dụ: 2 component mount cùng lúc).
    const drained = pendingInits
    pendingInits = []
    drained.forEach((cb) => cb())
  } finally {
    initInFlight = false
  }
}

/** Render nút "Continue with Google" chuẩn của Google vào container. */
export async function renderGoogleButton(
  container: HTMLElement,
  options?: {
    width?: number
    theme?: 'outline' | 'filled_blue' | 'filled_black'
    size?: 'large' | 'medium' | 'small'
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
    shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  },
) {
  await ensureGisLoaded()
  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity Services không khả dụng.')
  }
  // Clear nội dung cũ (tránh double-render trong StrictMode)
  container.innerHTML = ''
  window.google.accounts.id.renderButton(container, {
    type: 'standard',
    theme: options?.theme ?? 'outline',
    size: options?.size ?? 'large',
    text: options?.text ?? 'continue_with',
    shape: options?.shape ?? 'rectangular',
    logo_alignment: 'left',
    width: options?.width ?? Math.min(container.clientWidth || 320, 400),
  })
}

/**
 * Bật One Tap: khi trang load xong, Google sẽ tự động hiện bảng chọn tài khoản
 * ở góc trên bên phải màn hình nếu user đã có account Google đăng nhập sẵn
 * trên trình duyệt.
 */
export async function showOneTap() {
  await ensureGisLoaded()
  if (!window.google?.accounts?.id) return
  window.google.accounts.id.prompt((notification) => {
    // Chỉ log lý do nếu One Tap bị chặn — không spam console khi hoạt động bình thường.
    if (notification.isNotDisplayed()) {
      const reason = notification.getNotDisplayedReason()
      // Các reason thường gặp:
      //   - "browser_not_supported", "invalid_client", "missing_client_id",
      //   - "opt_out_or_no_session", "secure_http_error", "suppressed_by_user",
      //   - "unregistered_origin", "third_party_cookies_disabled"
      // eslint-disable-next-line no-console
      console.info('[Google One Tap] Không hiển thị:', reason)
    } else if (notification.isSkippedMoment()) {
      // eslint-disable-next-line no-console
      console.info('[Google One Tap] Bị bỏ qua:', notification.getSkippedReason())
    }
  })
}

/** Hủy One Tap (ví dụ khi user đã đăng nhập thành công và rời trang login). */
export function cancelOneTap() {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.cancel()
  }
}

// ─── Helper: hoàn tất flow Google login ────────────────────────
/** Gọi sau khi nhận idToken từ Google — gửi về backend và lưu vào auth store. */
export async function completeGoogleLogin(
  idToken: string,
  navigate: (path: string) => void,
) {
  const data: LoginResponse = await authApi.googleLogin(idToken)
  const user = {
    userId: data.userId,
    username: data.username,
    email: data.email,
    role: data.role as 'Admin' | 'Moderator' | 'Player',
    displayName: data.displayName,
    avatarUrl: data.avatarUrl,
    sessionId: data.sessionId,
  }
  useAuthStore.setState({
    user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    isAuthenticated: true,
  })
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)

  notify.success(
    `Chào mừng ${data.displayName || data.username}!`,
    'Google Login',
  )

  if (data.role === 'Admin') navigate('/admin')
  else if (data.role === 'Moderator') navigate('/moderator')
  else navigate('/portal')
}