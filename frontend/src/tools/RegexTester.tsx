import { useMemo, useState } from 'react'

const RegexTester = () => {
  const [pattern, setPattern] = useState('[a-z]+')
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('Hello UtilKit\n123 abc def')

  const result = useMemo(() => {
    if (!pattern) return { segments: [{ text, match: false }], matches: [], error: '' }
    try {
      const regex = new RegExp(pattern, flags)
      const matches: { text: string; index: number }[] = []
      const segments: { text: string; match: boolean }[] = []
      let lastIndex = 0
      let exec: RegExpExecArray | null = null
      while ((exec = regex.exec(text)) !== null) {
        const [match] = exec
        const start = exec.index
        const end = start + match.length
        if (start > lastIndex) segments.push({ text: text.slice(lastIndex, start), match: false })
        segments.push({ text: match, match: true })
        matches.push({ text: match, index: start })
        lastIndex = end
        if (!regex.global) break
      }
      if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), match: false })
      return { segments, matches, error: '' }
    } catch (err) {
      return {
        segments: [{ text, match: false }],
        matches: [],
        error: (err as Error).message,
      }
    }
  }, [flags, pattern, text])

  return (
    <div className="tool">
      <div className="field">
        <label>패턴</label>
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} />
      </div>
      <div className="field">
        <label>플래그 (예: g i m)</label>
        <input value={flags} onChange={(e) => setFlags(e.target.value.replace(/\\s/g, ''))} />
      </div>
      <div className="field">
        <label>테스트 문자열</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      </div>
      {result.error && <div className="error">에러: {result.error}</div>}
      <div className="field">
        <label>결과</label>
        <div className="regex-output">
          {result.segments.map((segment, idx) => (
            <span key={`${segment.text}-${idx}`} className={segment.match ? 'match' : ''}>
              {segment.text}
            </span>
          ))}
        </div>
      </div>
      <div className="matches">
        {result.matches.length ? (
          result.matches.map((m, i) => (
            <div key={`${m.text}-${i}`} className="match-pill">
              #{i + 1} “{m.text}” @ {m.index}
            </div>
          ))
        ) : (
          <p className="muted">일치 결과가 없습니다.</p>
        )}
      </div>
    </div>
  )
}

export default RegexTester

