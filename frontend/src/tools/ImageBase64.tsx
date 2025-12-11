import { useState } from 'react'

const ImageBase64 = () => {
  const [preview, setPreview] = useState<string | null>(null)
  const [base64, setBase64] = useState('')

  const onFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result?.toString() ?? ''
      setPreview(result)
      setBase64(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="tool">
      <div className="field">
        <label>이미지 선택</label>
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="preview" />
        </div>
      )}
      <div className="field">
        <label>Base64 결과</label>
        <textarea value={base64} readOnly rows={8} />
      </div>
      <p className="muted">파일은 서버로 전송되지 않고 브라우저 메모리에서만 처리됩니다.</p>
    </div>
  )
}

export default ImageBase64

