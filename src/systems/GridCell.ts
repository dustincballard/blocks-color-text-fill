import * as PIXI from 'pixi.js'

export class GridCell extends PIXI.Graphics {
  baseX: number
  baseY: number
  targetRotation: number
  currentRotation: number
  size: number
  color: number
  worldX: number
  worldY: number
  isNameCell: boolean
  fillProgress: number
  targetFillProgress: number

  constructor(x: number, y: number, size: number) {
    super()
    this.baseX = x
    this.baseY = y
    this.worldX = x
    this.worldY = y
    this.x = x
    this.y = y
    this.size = size
    this.targetRotation = 0
    this.currentRotation = 0
    this.color = 0x2a2a2a
    this.isNameCell = false
    this.fillProgress = 0
    this.targetFillProgress = 0
    this.draw()
  }

  draw() {
    this.clear()
    this.lineStyle(1, this.color)
    this.beginFill(this.color, this.isNameCell ? 0.5 * this.fillProgress : 0.1)
    this.drawRect(-this.size/2, -this.size/2, this.size, this.size)
    this.endFill()
  }

  update(time: number, mouseX: number, mouseY: number) {
    const dx = mouseX - this.worldX
    const dy = mouseY - this.worldY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    const wave = Math.sin(time * 0.002 + (this.baseX + this.baseY) * 0.05) * 5
    this.y = this.baseY + wave
    this.worldY = this.y

    const maxDistance = 200
    const interactionStrength = Math.max(0, 1 - (distance / maxDistance))
    
    const angle = Math.atan2(dy, dx)
    this.targetRotation = interactionStrength * angle

    this.currentRotation += (this.targetRotation - this.currentRotation) * 0.1
    this.rotation = this.currentRotation

    this.fillProgress += (this.targetFillProgress - this.fillProgress) * 0.1

    const hue = (time * 0.1 + distance * 0.1) % 360
    const targetColor = this.isNameCell 
      ? this.hslToHex((time * 0.5) % 360, 100, 60)
      : interactionStrength > 0.2 
        ? this.hslToHex(hue, 70, 60)
        : 0x2a2a2a
    
    this.color = targetColor
    this.draw()
  }

  private hslToHex(h: number, s: number, l: number): number {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return parseInt(`0x${toHex(r)}${toHex(g)}${toHex(b)}`)
  }
}
