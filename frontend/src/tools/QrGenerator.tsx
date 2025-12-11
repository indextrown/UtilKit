import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const QrGenerator = () => {
  const [text, setText] = useState('https://utilkit.local')
  const [size, setSize] = useState(200)
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const make = async () => {
      try {
        const url = await QRCode.toDataURL(text || ' ', { width: size, margin: 1 })
        setDataUrl(url)
        setError('')
      } catch (err) {
        setError((err as Error).message)
      }
    }
    make()
  }, [size, text])

  const download = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'utilkit-qr.png'
    link.click()
  }

  return (
    <div className="tool">
      <div className="field">
        <label>텍스트</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
      </div>
      <div className="field">
        <label>크기</label>
        <input
          type="range"
          min={120}
          max={360}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <span className="muted">{size}px</span>
      </div>
      {error && <div className="error">에러: {error}</div>}
      <div className="qr-preview" style={{ width: size, height: size }}>
        {dataUrl ? <img src={dataUrl} alt="QR code" /> : <p className="muted">생성 중…</p>}
      </div>
      <div className="actions">
        <button onClick={download} disabled={!dataUrl}>
          PNG 다운로드
        </button>
      </div>
    </div>
  )
}

export default QrGenerator

