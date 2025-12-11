import { useState } from 'react'

const UrlEncoder = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const run = () => {
    try {
      const result = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
      setOutput(result)
    } catch (err) {
      setOutput((err as Error).message)
    }
  }

  return (
    <div className="tool">
      <div className="segmented">
        <button
          className={mode === 'encode' ? 'active' : ''}
          onClick={() => setMode('encode')}
        >
          인코딩
        </button>
        <button
          className={mode === 'decode' ? 'active' : ''}
          onClick={() => setMode('decode')}
        >
          디코딩
        </button>
      </div>
      <div className="field">
        <label>입력</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} />
      </div>
      <div className="actions">
        <button onClick={run}>실행</button>
      </div>
      <div className="field">
        <label>출력</label>
        <textarea value={output} readOnly rows={5} />
      </div>
    </div>
  )
}

export default UrlEncoder

