# Hold-My-Hand-Frontend

Giao diện quản lý game **Hold My Hand** — React + TypeScript + Vite + TailwindCSS.

## Cấu trúc dự án

```
Hold-My-Hand-Frontend/
├── src/
│   ├── api/                # Gọi API đến Backend
│   │   ├── auth.ts         # Login, Register, Logout, Refresh
│   │   ├── accounts.ts     # Admin: CRUD user, ban/unban, logs, active rooms
│   │   ├── profile.ts      # Web Portal: Profile, Update, History
│   │   ├── rooms.ts        # Admin: Active rooms
│   │   ├── characters.ts   # Game Client: characters
│   │   ├── chapters.ts     # Chapters + Quests
│   │   └── audit.ts        # Audit logs
│   ├── components/
│   │   ├── ui/             # Button, Input, Modal, Card, Badge, Table
│   │   └── layout/         # Layout (Admin/Mod), PortalLayout (Player)
│   ├── pages/
│   │   ├── auth/           # Login, Register
│   │   ├── admin/          # Dashboard, AccountManagement, AuditLogs, ActiveRooms
│   │   ├── moderator/      # Dashboard, Characters, Chapters, Quests
│   │   └── portal/         # Home, Profile, History, Lobby (cho Player)
│   ├── stores/             # Zustand stores (auth, notifications)
│   ├── types/              # TypeScript interfaces (khớp với DTO backend)
│   ├── utils/              # Helpers
│   └── lib/                # Axios config + auto-refresh token
└── public/
```

## Backend tương ứng

- **Auth API** (`/api/auth/*`) — Login, Register, Logout, Refresh
- **Admin API** (`/api/admin/*`) — Accounts CRUD, Ban/Unban, Logs, Active Rooms
- **Player API** (`/api/player/*`) — Profile, Update, History
- **Game API** (`/api/game/*`) — Lobby, Characters, Chapters, Quests

## Tính năng

### 🔐 Auth (Ảnh 1 - Glassmorphism gradient tím)
- Trang Login với background gradient động, blob animations
- Form đăng nhập với glassmorphism (backdrop-blur)
- **Google Sign-In bằng Google Identity Services (GIS)**:
  - Nút **"Continue with Google"** chính hãng do Google render (mở popup chọn tài khoản)
  - **Google One Tap** — bảng chọn tài khoản tự trượt vào góc trên phải ngay khi vào trang
  - `idToken` được gửi về backend `/api/auth/google` (xem `src/lib/googleAuth.ts`)
- Demo accounts hiển thị ngay trong form
- Trang Register đầy đủ validation

### Cấu hình Google Sign-In

1. Tạo OAuth Web Client trên [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Tại **Authorized JavaScript origins** thêm chính xác (không có dấu `/` ở cuối):
   ```
   http://localhost:3000
   http://localhost
   ```
3. Copy `Client ID` rồi tạo file `.env.local` (cùng cấp với `package.json`):
   ```env
   VITE_API_URL=http://localhost:5181
   VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxx.apps.googleusercontent.com
   ```
4. Khởi động lại `npm run dev` để Vite nạp biến môi trường.

> One Tap có thể bị chặn do `third_party_cookies_disabled` (Safari ITP), `opt_out_or_no_session`, hoặc user chưa từng đăng nhập Google trên trình duyệt. Khi đó người dùng vẫn có thể bấm nút "Continue with Google" để mở popup chọn tài khoản.

### 🛡️ Admin Dashboard (Ảnh 2 - Sidebar trắng + top bar tối)
- 4 stat cards với gradient riêng (Users, Active, Players, Banned)
- Hoạt động gần đây (audit logs)
- Phòng đang chơi (live lobbies)
- Người dùng mới nhất
- **Quản lý User** — CRUD, Ban/Unban với lý do, search/filter
- **Active Rooms** — Real-time lobbies với auto-refresh
- **System Logs** — Audit trail với filter theo action

### 🎮 Moderator Dashboard
- Dashboard tổng quan nội dung game
- Character Stats (read-only từ API)
- Chapters list
- Quests theo chapter

### 👤 Web Portal (cho Player - gradient tím)
- **Home**: Welcome card + stats + quick links
- **Profile**: Cập nhật display name, avatar URL, đổi mật khẩu
- **History**: Thống kê + danh sách trận đấu gần đây
- **Lobby**: Tạo/Tham gia phòng với mã 6 ký tự

## Setup

```bash
npm install
npm run dev
```

Mặc định frontend chạy ở `http://localhost:3000` và proxy sang backend `http://localhost:5181`.

## Tài khoản demo

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@123` |
| Moderator | `moderator` | `Mod@123` |
| Player | `player1` | `Player@123` |
| Player | `player2` | `Player@123` |

## Scripts

- `npm run dev` — Dev server với HMR
- `npm run build` — Production build
- `npm run preview` — Preview build output
- `npm run lint` — ESLint
