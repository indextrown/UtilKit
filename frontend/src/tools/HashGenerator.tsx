import { useState } from 'react'

const algorithms: AlgorithmIdentifier[] = ['SHA-256', 'SHA-384', 'SHA-512']

const HashGenerator = () => {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState<AlgorithmIdentifier>('SHA-256')
  const [hash, setHash] = useState('')
  const [error, setError] = useState('')

  const generate = async () => {
    try {
      const encoder = new TextEncoder()
      const buffer = encoder.encode(input)
      const digest = await crypto.subtle.digest(algorithm, buffer)
      const bytes = Array.from(new Uint8Array(digest))
      const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
      setHash(hex)
      setError('')
    } catch (err) {
      setError((err as Error).message)
      setHash('')
    }
  }

  return (
    <div className="tool">
      <div className="field">
        <label>알고리즘</label>
        <select value={algorithm.toString()} onChange={(e) => setAlgorithm(e.target.value)}>
          {algorithms.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>입력 텍스트</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} />
      </div>
      <div className="actions">
        <button onClick={generate}>해시 생성</button>
      </div>
      {error && <div className="error">에러: {error}</div>}
      <div className="field">
        <label>해시 결과</label>
        <textarea value={hash} readOnly rows={4} />
      </div>
    </div>
  )
}

export default HashGenerator

