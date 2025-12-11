import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import './App.css'
import Base64Tool from './tools/Base64Tool'
import ColorConverter from './tools/ColorConverter'
import HashGenerator from './tools/HashGenerator'
import ImageBase64 from './tools/ImageBase64'
import JsonFormatter from './tools/JsonFormatter'
import QrGenerator from './tools/QrGenerator'
import RegexTester from './tools/RegexTester'
import UrlEncoder from './tools/UrlEncoder'
import UuidGenerator from './tools/UuidGenerator'
import ImageToPdf from './tools/pdf/ImageToPdf'
import PageExtract from './tools/pdf/PageExtract'
import PdfCompress from './tools/pdf/PdfCompress'
import PdfMerge from './tools/pdf/PdfMerge'
import PdfSplit from './tools/pdf/PdfSplit'
import PdfTextExtract from './tools/pdf/PdfTextExtract'
import PdfToImage from './tools/pdf/PdfToImage'
import PdfSixUp from './tools/pdf/PdfSixUp'

type Category = 'developer' | 'image' | 'pdf'

type ToolConfig = {
  id: string
  title: string
  description: string
  category: Category
  component: () => JSX.Element
}

const tools: ToolConfig[] = [
  {
    id: 'json',
    title: 'JSON 포매터',
    description: 'JSON 정렬 및 검증',
    category: 'developer',
    component: JsonFormatter,
  },
  {
    id: 'base64',
    title: 'BASE64',
    description: 'Base64 인코딩/디코딩',
    category: 'developer',
    component: Base64Tool,
  },
  {
    id: 'url',
    title: 'URL 인코더',
    description: 'URL 인코딩/디코딩',
    category: 'developer',
    component: UrlEncoder,
  },
  {
    id: 'hash',
    title: '해시 생성기',
    description: 'SHA 해시 생성 (클라이언트)',
    category: 'developer',
    component: HashGenerator,
  },
  {
    id: 'color',
    title: '색상 변환기',
    description: 'HEX, RGB, HSL 변환',
    category: 'developer',
    component: ColorConverter,
  },
  {
    id: 'uuid',
    title: 'UUID 생성기',
    description: '고유 ID 생성',
    category: 'developer',
    component: UuidGenerator,
  },
  {
    id: 'regex',
    title: '정규식 테스터',
    description: '정규표현식 테스트',
    category: 'developer',
    component: RegexTester,
  },
  {
    id: 'qr',
    title: 'QR 생성기',
    description: '텍스트로 QR 코드 생성',
    category: 'developer',
    component: QrGenerator,
  },
  {
    id: 'image-base64',
    title: '이미지 → BASE64',
    description: '이미지를 Base64로 변환 (클라이언트)',
    category: 'image',
    component: ImageBase64,
  },
  {
    id: 'pdf-to-image',
    title: 'PDF → 이미지',
    description: 'PDF 페이지를 이미지로 변환',
    category: 'pdf',
    component: PdfToImage,
  },
  {
    id: 'image-to-pdf',
    title: '이미지 → PDF',
    description: '여러 이미지를 PDF로 생성',
    category: 'pdf',
    component: ImageToPdf,
  },
  {
    id: 'pdf-merge',
    title: 'PDF 합치기',
    description: '여러 PDF를 병합',
    category: 'pdf',
    component: PdfMerge,
  },
  {
    id: 'pdf-split',
    title: 'PDF 분할',
    description: '페이지 범위로 분할',
    category: 'pdf',
    component: PdfSplit,
  },
  {
    id: 'pdf-compress',
    title: 'PDF 압축',
    description: '베스트 에포트 재저장 압축',
    category: 'pdf',
    component: PdfCompress,
  },
  {
    id: 'page-extract',
    title: '페이지 추출',
    description: '지정한 페이지만 추출',
    category: 'pdf',
    component: PageExtract,
  },
  {
    id: 'pdf-text',
    title: 'PDF 텍스트 추출',
    description: '텍스트만 추출',
    category: 'pdf',
    component: PdfTextExtract,
  },
  {
    id: 'pdf-sixup',
    title: 'PDF 6분할',
    description: '한 페이지에 6페이지 배치',
    category: 'pdf',
    component: PdfSixUp,
  },
]

const categories: { id: Category; label: string }[] = [
  { id: 'developer', label: '개발자 도구' },
  { id: 'image', label: '이미지 도구' },
  { id: 'pdf', label: 'PDF 도구' },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeToolId, setActiveToolId] = useState<string>('json')

  const filteredTools = useMemo(() => {
    const lower = query.trim().toLowerCase()
    if (!lower) return tools
    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(lower) ||
        tool.description.toLowerCase().includes(lower),
    )
  }, [query])

  const activeTool = tools.find((tool) => tool.id === activeToolId) ?? tools[0]

  return (
    <div className="page">
      <header className="hero">
        <div className="brand">
          <div className="logo">UK</div>
          <div>
            <p className="eyebrow">UTILKIT</p>
            <h1>브라우저에서 끝내는 개발 유틸리티</h1>
            <p className="subtitle">
              모든 처리는 로컬 브라우저에서 수행되어 파일 업로드 없이 안전합니다.
            </p>
          </div>
        </div>
        <div className="search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="도구 검색…"
          />
        </div>
      </header>

      <div className="layout">
        <main className="catalog">
          {categories.map((category) => {
            const group = filteredTools.filter((tool) => tool.category === category.id)
            return (
              <section key={category.id} className="section">
                <div className="section-header">
                  <h2>{category.label}</h2>
                  {category.id !== 'developer' && (
                    <span className="badge">클라이언트 처리</span>
                  )}
                </div>
                <div className="grid">
                  {group.map((tool) => (
                    <button
                      key={tool.id}
                      className={`card ${tool.id === activeTool.id ? 'card-active' : ''}`}
                      onClick={() => setActiveToolId(tool.id)}
                    >
                      <div className="card-title">{tool.title}</div>
                      <p className="card-desc">{tool.description}</p>
                    </button>
                  ))}
                  {!group.length && (
                    <div className="empty">검색어와 일치하는 도구가 없어요.</div>
                  )}
                </div>
                {category.id === 'pdf' && (
                  <p className="coming-soon">
                    PDF 관련 도구는 모두 브라우저에서 동작하도록 설계 예정입니다.
                    (추가 구현 예정)
                  </p>
                )}
              </section>
            )
          })}
        </main>

        <aside className="workspace">
          <div className="workspace-header">
            <div>
              <p className="eyebrow">선택한 도구</p>
              <h3>{activeTool.title}</h3>
              <p className="muted">{activeTool.description}</p>
            </div>
            <div className="pill">클라이언트 처리</div>
          </div>
          <div className="workspace-body">
            <activeTool.component />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
