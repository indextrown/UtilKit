import { useState } from 'react'

const JsonFormatter = () => {
  const [input, setInput] = useState('{\n  "hello": "world"\n}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (err) {
      setError((err as Error).message)
      setOutput('')
    }
  }

  return (
    <div className="tool">
      <div className="field">
        <label>JSON 입력</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
        />
      </div>
      <div className="actions">
        <button onClick={format}>포맷 / 검증</button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      <div className="field">
        <label>결과</label>
        <textarea value={output} readOnly rows={8} spellCheck={false} />
      </div>
    </div>
  )
}

export default JsonFormatter

