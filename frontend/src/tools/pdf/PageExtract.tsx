import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

const parseList = (value: string, total: number) => {
  const tokens = value
    .split(',')
    .map((t) => Number(t.trim()))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= total)
  const unique = Array.from(new Set(tokens))
  return unique.map((n) => n - 1) // zero-based
}

const PageExtract = () => {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState('1')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const extract = async () => {
    if (!file) return
    setProcessing(true)
    setError('')
    try {
      const buffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buffer)
      const indexes = parseList(pages, pdf.getPageCount())
      if (!indexes.length) throw new Error('추출할 페이지가 없습니다.')
      const out = await PDFDocument.create()
      const copied = await out.copyPages(pdf, indexes)
      copied.forEach((p) => out.addPage(p))
      const bytes = await out.save({ useObjectStreams: true })
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `pages-${pages.replace(/\s+/g, '')}.pdf`
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
        <label>추출할 페이지 (쉼표 구분, 예: 1,3,5)</label>
        <input value={pages} onChange={(e) => setPages(e.target.value)} />
      </div>
      <div className="actions">
        <button onClick={extract} disabled={!file || processing}>
          {processing ? '추출 중...' : '추출'}
        </button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      {file && <p className="muted">선택한 파일: {file.name}</p>}
    </div>
  )
}

export default PageExtract

