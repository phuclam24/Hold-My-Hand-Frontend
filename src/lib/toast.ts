import { toast, ToastOptions } from 'react-toastify'

const baseOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
}

export const notify = {
  success: (message: string, title?: string) =>
    toast.success(title ? `${title} — ${message}` : message, {
      ...baseOptions,
      icon: () => '🎉',
    }),

  error: (message: string, title?: string) =>
    toast.error(title ? `${title} — ${message}` : message, {
      ...baseOptions,
      autoClose: 5000,
    }),

  info: (message: string, title?: string) =>
    toast.info(title ? `${title} — ${message}` : message, {
      ...baseOptions,
      icon: () => 'ℹ️',
    }),


  warning: (message: string, title?: string) =>
    toast.warning(title ? `${title} — ${message}` : message, {
      ...baseOptions,
    }),

  loading: (message: string) =>
    toast.loading(message, {
      ...baseOptions,
      autoClose: false,
      closeOnClick: false,
    }),

  update: (id: string, type: 'success' | 'error' | 'info', message: string) =>
    toast.update(id, {
      render: message,
      type,
      isLoading: false,
      autoClose: 3500,
    }),

  dismiss: (id?: string) => {
    if (id) toast.dismiss(id)
    else toast.dismiss()
  },
}
