import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

const PdfCompress = () => {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const compress = async () => {
    if (!file) return
    setProcessing(true)
    setError('')
    try {
      const buffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buffer)
      const bytes = await pdf.save({ useObjectStreams: true })
      const blob = new Blob([bytes.buffer], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `compressed-${file.name}`
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
      <p className="muted">품질을 유지하며 구조를 재저장하는 간단한 압축(베스트 에포트)입니다.</p>
      <div className="field">
        <label>PDF 선택</label>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="actions">
        <button onClick={compress} disabled={!file || processing}>
          {processing ? '압축 중...' : '압축'}
        </button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      {file && <p className="muted">선택한 파일: {file.name}</p>}
    </div>
  )
}

export default PdfCompress

