import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

const PdfMerge = () => {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const onSelect = (list?: FileList | null) => {
    if (!list) return
    setFiles(Array.from(list))
  }

  const merge = async () => {
    if (!files.length) return
    setProcessing(true)
    setError('')
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(buffer)
        const copied = await merged.copyPages(pdf, pdf.getPageIndices())
        copied.forEach((p) => merged.addPage(p))
      }
      const bytes = await merged.save({ useObjectStreams: true })
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'merged.pdf'
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
        <label>PDF 선택 (여러 개)</label>
        <input type="file" accept="application/pdf" multiple onChange={(e) => onSelect(e.target.files)} />
      </div>
      <div className="actions">
        <button onClick={merge} disabled={!files.length || processing}>
          {processing ? '병합 중...' : '병합'}
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

export default PdfMerge

