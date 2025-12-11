import { useState } from 'react'
import { getDocument } from 'pdfjs-dist'
import './pdfWorker'

type RenderedPage = { page: number; url: string }

const PdfToImage = () => {
  const [pages, setPages] = useState<RenderedPage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file?: File | null) => {
    if (!file) return
    setLoading(true)
    setError('')
    setPages([])
    try {
      const buffer = await file.arrayBuffer()
      const pdf = await getDocument({ data: buffer }).promise
      const results: RenderedPage[] = []
      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        if (!context) throw new Error('Canvas context를 만들 수 없습니다.')
        await page.render({ canvasContext: context, viewport }).promise
        results.push({ page: i, url: canvas.toDataURL('image/png') })
      }
      setPages(results)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tool">
      <div className="field">
        <label>PDF 선택</label>
        <input type="file" accept="application/pdf" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
      {loading && <p className="muted">이미지 변환 중...</p>}
      {error && <div className="error">에러: {error}</div>}
      <div className="list">
        {pages.map((p) => (
          <div key={p.page} className="list-item">
            <div className="actions" style={{ justifyContent: 'space-between' }}>
              <strong>Page {p.page}</strong>
              <a href={p.url} download={`page-${p.page}.png`}>
                <button>PNG 다운로드</button>
              </a>
            </div>
            <div className="image-preview">
              <img src={p.url} alt={`page-${p.page}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PdfToImage

