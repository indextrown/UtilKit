const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// 간단한 헬스 체크
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'UtilKit', mode: 'client-first' })
})

// 백엔드가 파일을 처리하지 않는다는 선언적 엔드포인트
app.get('/info', (_req, res) => {
  res.json({
    message: 'UtilKit backend is minimal by design. All utilities run in the browser.',
    uploads: 'not accepted',
    version: '0.1.0',
  })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`UtilKit backend running on http://localhost:${PORT}`)
})

