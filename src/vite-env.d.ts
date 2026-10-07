/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ─── Google Identity Services (GIS) global typings ──────────────
// Reference: https://developers.google.com/identity/oauth2/web/guides/use-token-model
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace google {
    namespace accounts {
      namespace id {
        interface IdConfiguration {
          client_id: string
          callback: (response: CredentialResponse) => void
          auto_select?: boolean
          cancel_on_tap_outside?: boolean
          context?: 'signin' | 'signup' | 'use'
          itp_support?: boolean
          login_uri?: string
          native_callback?: (response: CredentialResponse) => void
          nonce?: string
          prompt_parent_id?: string
          state_cookie_domain?: string
          ux_mode?: 'popup' | 'redirect'
          allowed_parent_origin?: string | string[]
          intermediate_iframe_close_callback?: () => void
        }

        interface CredentialResponse {
          credential: string
          select_by?: string
          clientId?: string
        }

        interface PromptMomentNotification {
          isDisplayed(): boolean
          isNotDisplayed(): boolean
          getNotDisplayedReason(): string
          isSkippedMoment(): boolean
          getSkippedReason(): string
          isDismissedMoment(): boolean
          getDismissedReason(): string
          getMomentType(): string
        }

        interface GsiButtonConfiguration {
          type?: 'standard' | 'icon'
          theme?: 'outline' | 'filled_blue' | 'filled_black'
          size?: 'large' | 'medium' | 'small'
          text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
          shape?: 'rectangular' | 'pill' | 'circle' | 'square'
          logo_alignment?: 'left' | 'center'
          width?: number
          locale?: string
          click_listener?: () => void
        }

        function initialize(config: IdConfiguration): void
        function prompt(
          callback?: (notification: PromptMomentNotification) => void,
        ): void
        function renderButton(
          parent: HTMLElement,
          options: GsiButtonConfiguration,
        ): void
        function disableAutoSelect(): void
        function storeCredential(
          credential: { id: string, password: string },
          callback?: () => void,
        ): void
        function cancel(): void
      }
    }
  }
}

export {}