'use client'

export default function ConfirmButton({
  children,
  confirmText,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { confirmText?: string }) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!window.confirm(confirmText || 'Bạn có chắc chắn?')) {
          e.preventDefault()
        }
      }}
    >
      {children}
    </button>
  )
}