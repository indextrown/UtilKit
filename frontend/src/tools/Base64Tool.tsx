import { useState } from 'react'

const Base64Tool = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const convert = () => {
    try {
      const result =
        mode === 'encode'
          ? btoa(String.fromCharCode(...new TextEncoder().encode(input)))
          : new TextDecoder().decode(Uint8Array.from(atob(input), (c) => c.charCodeAt(0)))
      setOutput(result)
      setError('')
    } catch (err) {
      setError((err as Error).message)
      setOutput('')
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
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} />
      </div>
      <div className="actions">
        <button onClick={convert}>실행</button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      <div className="field">
        <label>출력</label>
        <textarea value={output} readOnly rows={6} />
      </div>
    </div>
  )
}

export default Base64Tool

