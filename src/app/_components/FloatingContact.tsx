type Props = {
  zaloSo?: string | null
  viberSo?: string | null
}

export default function FloatingContact({ zaloSo, viberSo }: Props) {
  if (!zaloSo && !viberSo) return null

  const zaloLink = zaloSo ? 'https://zalo.me/' + zaloSo.replace(/\s/g, '') : ''
  const viberNumber = viberSo ? viberSo.replace(/\s/g, '').replace(/^0/, '') : ''
  const viberLink = viberSo ? 'viber://chat?number=%2B84' + viberNumber : ''

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {zaloSo && (
        <a
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Zalo"
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#0068ff',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '13px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          }}
        >
          Zalo
        </a>
      )}

      {viberSo && (
        <a
          href={viberLink}
          title="Chat Viber"
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#7360f2',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '11px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          }}
        >
          Viber
        </a>
      )}
    </div>
  )
}
