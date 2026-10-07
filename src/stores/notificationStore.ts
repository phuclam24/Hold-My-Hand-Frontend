import { notify } from '@/lib/toast'

/**
 * @deprecated Hook stub — chuyển sang dùng `notify` từ `@/lib/toast`.
 * Giữ để tương thích code cũ, các method addNotification/... gọi thẳng qua notify.
 */
export function useNotificationStore() {
  return {
    notifications: [],
    addNotification: (n: {
      type: 'success' | 'error' | 'warning' | 'info'
      title?: string
      message: string
      duration?: number
    }) => {
      if (n.type === 'success') notify.success(n.message, n.title)
      else if (n.type === 'error') notify.error(n.message, n.title)
      else if (n.type === 'warning') notify.warning(n.message, n.title)
      else notify.info(n.message, n.title)
    },
    removeNotification: () => {},
    clearAll: () => notify.dismiss(),
  }
}
