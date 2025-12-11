import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

type Orientation = 'auto' | 'portrait' | 'landscape'

const PdfSixUp = () => {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(2)
  const [orientation, setOrientation] = useState<Orientation>('portrait')

  const sixUp = async () => {
    if (!file) return
    const r = Math.max(1, Math.min(6, Math.floor(rows)))
    const c = Math.max(1, Math.min(6, Math.floor(cols)))
    const perPage = r * c

    setProcessing(true)
    setError('')
    try {
      const buffer = await file.arrayBuffer()
      const src = await PDFDocument.load(buffer)
      const out = await PDFDocument.create()

      const srcFirst = src.getPage(0)
      let baseWidth = srcFirst.getWidth()
      let baseHeight = srcFirst.getHeight()

      if (orientation === 'portrait' && baseWidth > baseHeight) {
        ;[baseWidth, baseHeight] = [baseHeight, baseWidth]
      } else if (orientation === 'landscape' && baseHeight > baseWidth) {
        ;[baseWidth, baseHeight] = [baseHeight, baseWidth]
      }

      const margin = 12
      const cellWidth = baseWidth / c
      const cellHeight = baseHeight / r

      const total = src.getPageCount()
      const pageIndices = Array.from({ length: total }, (_, i) => i)

      for (let i = 0; i < pageIndices.length; i += perPage) {
        const chunk = pageIndices.slice(i, i + perPage)
        const embedded = await out.embedPages(chunk.map((idx) => src.getPage(idx)))
        const page = out.addPage([baseWidth, baseHeight])

        embedded.forEach((p, index) => {
          const col = index % c
          const row = Math.floor(index / c)
          const targetX = col * cellWidth + margin / 2
          const targetY = baseHeight - (row + 1) * cellHeight + margin / 2
          const scale = Math.min(cellWidth / p.width, cellHeight / p.height) - 0.02
          const drawWidth = p.width * scale
          const drawHeight = p.height * scale
          const centeredX = targetX + (cellWidth - drawWidth) / 2
          const centeredY = targetY + (cellHeight - drawHeight) / 2
          page.drawPage(p, { x: centeredX, y: centeredY, width: drawWidth, height: drawHeight })
        })
      }

      const bytes = await out.save({ useObjectStreams: true })
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `multi-${r}x${c}-${file.name}`
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
      <p className="muted">
        한 페이지에 여러 페이지를 재배치합니다. 모든 처리는 브라우저에서 수행됩니다.
      </p>
      <div className="field">
        <label>PDF 선택</label>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="field">
        <label>배치 (행 x 열)</label>
        <div className="actions" style={{ gap: '6px' }}>
          <input
            type="number"
            min={1}
            max={6}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            aria-label="rows"
            style={{ width: '80px' }}
          />
          <span style={{ alignSelf: 'center' }}>x</span>
          <input
            type="number"
            min={1}
            max={6}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            aria-label="cols"
            style={{ width: '80px' }}
          />
          <span className="muted">({rows * cols} 분할)</span>
        </div>
      </div>
      <div className="field">
        <label>용지 방향</label>
        <select value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)}>
          <option value="auto">원본 비율 유지</option>
          <option value="portrait">세로</option>
          <option value="landscape">가로</option>
        </select>
      </div>
      <div className="actions">
        <button onClick={sixUp} disabled={!file || processing}>
          {processing ? '생성 중...' : '분할 PDF 만들기'}
        </button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      {file && <p className="muted">선택한 파일: {file.name}</p>}
    </div>
  )
}

export default PdfSixUp

