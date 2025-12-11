import { useState } from 'react'

type RGB = { r: number; g: number; b: number }
type HSL = { h: number; s: number; l: number }

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const hexToRgb = (value: string): RGB | null => {
  const hex = value.replace('#', '')
  if (![3, 6].includes(hex.length)) return null
  const normalized = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  if ([r, g, b].some(Number.isNaN)) return null
  return { r, g, b }
}

const rgbToHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b].map((c) => clamp(c, 0, 255).toString(16).padStart(2, '0')).join('')}`

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  const rN = r / 255
  const gN = g / 255
  const bN = b / 255
  const max = Math.max(rN, gN, bN)
  const min = Math.min(rN, gN, bN)
  const delta = max - min
  let h = 0
  if (delta) {
    if (max === rN) h = ((gN - bN) / delta) % 6
    else if (max === gN) h = (bN - rN) / delta + 2
    else h = (rN - gN) / delta + 4
  }
  const l = (max + min) / 2
  const s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0
  return { h: Math.round(h * 60), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  const sN = s / 100
  const lN = l / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lN - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h >= 0 && h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

const ColorConverter = () => {
  const [hex, setHex] = useState('#22c55e')
  const [rgb, setRgb] = useState('34, 197, 94')
  const [hsl, setHsl] = useState('137, 72%, 45%')
  const [error, setError] = useState('')

  const updateFromHex = (value: string) => {
    setHex(value)
    const rgbValue = hexToRgb(value)
    if (!rgbValue) {
      setError('HEX 형식이 올바르지 않습니다.')
      return
    }
    const hslValue = rgbToHsl(rgbValue)
    setRgb(`${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}`)
    setHsl(`${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%`)
    setError('')
  }

  const updateFromRgb = (value: string) => {
    setRgb(value)
    const match = value.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/)
    if (!match) {
      setError('RGB는 "255, 255, 255" 형식이어야 합니다.')
      return
    }
    const [r, g, b] = match.slice(1).map((v) => clamp(Number(v), 0, 255))
    const rgbValue = { r, g, b }
    const hslValue = rgbToHsl(rgbValue)
    setHex(rgbToHex(rgbValue))
    setHsl(`${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%`)
    setError('')
  }

  const updateFromHsl = (value: string) => {
    setHsl(value)
    const match = value.match(/(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%/)
    if (!match) {
      setError('HSL은 "120, 50%, 40%" 형식이어야 합니다.')
      return
    }
    const [h, s, l] = match.slice(1).map((v) => Number(v))
    const hslValue = { h: clamp(h, 0, 360), s: clamp(s, 0, 100), l: clamp(l, 0, 100) }
    const rgbValue = hslToRgb(hslValue)
    setRgb(`${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}`)
    setHex(rgbToHex(rgbValue))
    setError('')
  }

  return (
    <div className="tool">
      <div className="swatch" style={{ background: hex }} />
      <div className="field">
        <label>HEX</label>
        <input value={hex} onChange={(e) => updateFromHex(e.target.value)} />
      </div>
      <div className="field">
        <label>RGB</label>
        <input value={rgb} onChange={(e) => updateFromRgb(e.target.value)} />
      </div>
      <div className="field">
        <label>HSL</label>
        <input value={hsl} onChange={(e) => updateFromHsl(e.target.value)} />
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default ColorConverter

