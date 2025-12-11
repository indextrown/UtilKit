import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

const ImageToPdf = () => {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  const onSelect = (list?: FileList | null) => {
    if (!list) return
    setFiles(Array.from(list))
  }

  const generate = async () => {
    if (!files.length) return
    setProcessing(true)
    setError('')
    try {
      const pdfDoc = await PDFDocument.create()
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        const isPng = file.type === 'image/png'
        const image = isPng ? await pdfDoc.embedPng(buffer) : await pdfDoc.embedJpg(buffer)
        const { width, height } = image.scale(1)
        const page = pdfDoc.addPage([width, height])
        page.drawImage(image, { x: 0, y: 0, width, height })
      }
      const bytes = await pdfDoc.save({ useObjectStreams: true })
      const blob = new Blob([bytes.buffer], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'images-to-pdf.pdf'
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="tool">
      <div className="field">
        <label>이미지 선택 (여러 장 가능)</label>
        <input type="file" accept="image/png, image/jpeg" multiple onChange={(e) => onSelect(e.target.files)} />
      </div>
      <p className="muted">순서는 선택한 파일 순서를 따릅니다.</p>
      <div className="actions">
        <button onClick={generate} disabled={!files.length || processing}>
          {processing ? '생성 중...' : 'PDF 생성'}
        </button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      <ul className="list">
        {files.map((f) => (
          <li key={f.name} className="list-item">
            {f.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ImageToPdf

