import { useState } from 'react'
import { getDocument } from 'pdfjs-dist'
import './pdfWorker'

const PdfTextExtract = () => {
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const extract = async (file?: File | null) => {
    if (!file) return
    setProcessing(true)
    setError('')
    setText('')
    try {
      const buffer = await file.arrayBuffer()
      const pdf = await getDocument({ data: buffer }).promise
      const contents: string[] = []
      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const strings = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .filter(Boolean)
          .join(' ')
        contents.push(`-- Page ${i} --\n${strings}`)
      }
      setText(contents.join('\n\n'))
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
        <input type="file" accept="application/pdf" onChange={(e) => extract(e.target.files?.[0])} />
      </div>
      {processing && <p className="muted">텍스트 추출 중...</p>}
      {error && <div className="error">에러: {error}</div>}
      <div className="field">
        <label>결과</label>
        <textarea value={text} readOnly rows={10} />
      </div>
    </div>
  )
}

export default PdfTextExtract

