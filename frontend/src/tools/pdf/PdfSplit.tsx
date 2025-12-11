import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

const parseRange = (value: string, total: number) => {
  const [startStr, endStr] = value.split('-').map((v) => v.trim())
  const start = Math.max(1, Number(startStr) || 1)
  const end = Math.min(total, Number(endStr) || total)
  if (start > end) return { start: end, end: start }
  return { start, end }
}

const PdfSplit = () => {
  const [file, setFile] = useState<File | null>(null)
  const [range, setRange] = useState('1-1')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  const split = async () => {
    if (!file) return
    setProcessing(true)
    setError('')
    try {
      const buffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buffer)
      const { start, end } = parseRange(range, pdf.getPageCount())
      const indexes = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1)
      const out = await PDFDocument.create()
      const copied = await out.copyPages(pdf, indexes)
      copied.forEach((p) => out.addPage(p))
      const bytes = await out.save({ useObjectStreams: true })
      const blob = new Blob([bytes.buffer], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `split-${start}-${end}.pdf`
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
        <label>PDF 선택</label>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="field">
        <label>페이지 범위 (예: 1-3)</label>
        <input value={range} onChange={(e) => setRange(e.target.value)} />
      </div>
      <div className="actions">
        <button onClick={split} disabled={!file || processing}>
          {processing ? '분할 중...' : '분할'}
        </button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      {file && <p className="muted">선택한 파일: {file.name}</p>}
    </div>
  )
}

export default PdfSplit


