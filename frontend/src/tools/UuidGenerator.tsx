import { useState } from 'react'

const UuidGenerator = () => {
  const [history, setHistory] = useState<string[]>([])

  const addUuid = () => {
    const id = crypto.randomUUID()
    setHistory((prev) => [id, ...prev].slice(0, 5))
  }

  return (
    <div className="tool">
      <div className="actions">
        <button onClick={addUuid}>UUID 생성</button>
      </div>
      <ul className="list">
        {history.map((id) => (
          <li key={id} className="list-item">
            <code>{id}</code>
          </li>
        ))}
      </ul>
      {!history.length && <p className="muted">생성한 UUID가 여기에 표시됩니다.</p>}
    </div>
  )
}

export default UuidGenerator

