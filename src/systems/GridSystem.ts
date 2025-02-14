import * as PIXI from 'pixi.js'
import { GridCell } from './GridCell'

export class GridSystem {
  private app: PIXI.Application
  private cells: GridCell[][]
  private container: PIXI.Container
  private cellSize: number
  private time: number
  private nameCells: Set<GridCell>
  private animationStartTime: number
  private words: { cells: GridCell[], delay: number }[]

  private readonly PATTERNS = {
    A: [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
    B: [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,1],[1,1,1,0]],
    C: [[0,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[0,1,1,1]],
    D: [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
    E: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
    F: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
    G: [[0,1,1,1],[1,0,0,0],[1,0,1,1],[1,0,0,1],[0,1,1,1]],
    H: [[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
    I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
    J: [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
    K: [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1]],
    L: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
    M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
    N: [[1,0,0,1],[1,1,0,1],[1,0,1,1],[1,0,0,1],[1,0,0,1]],
    O: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
    P: [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
    Q: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1]],
    R: [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1]],
    S: [[0,1,1,1],[1,0,0,0],[0,1,1,0],[0,0,0,1],[1,1,1,0]],
    T: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
    U: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
    V: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[0,1,0,0]],
    W: [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
    X: [[1,0,0,1],[0,1,1,0],[0,1,1,0],[0,1,1,0],[1,0,0,1]],
    Y: [[1,0,0,1],[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    Z: [[1,1,1,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,1]],
    ' ': [[0,0],[0,0],[0,0],[0,0],[0,0]]
  } as const

  constructor(app: PIXI.Application) {
    this.app = app
    this.cells = []
    this.container = new PIXI.Container()
    this.cellSize = 20
    this.time = 0
    this.nameCells = new Set()
    this.animationStartTime = 0
    this.words = []
    
    app.stage.addChild(this.container)
    this.createGrid()
  }

  private createGrid(): void {
    this.container.removeChildren()
    this.cells = []

    const cols = Math.ceil(this.app.screen.width / this.cellSize)
    const rows = Math.ceil(this.app.screen.height / this.cellSize)

    for (let j = 0; j < rows; j++) {
      const row: GridCell[] = []
      for (let i = 0; i < cols; i++) {
        const cell = new GridCell(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize * 0.95
        )
        row.push(cell)
        this.container.addChild(cell)
      }
      this.cells.push(row)
    }

    this.container.x = (this.app.screen.width - cols * this.cellSize) / 2
    this.container.y = (this.app.screen.height - rows * this.cellSize) / 2
  }

  displayName(name: string): void {
    this.nameCells.forEach(cell => {
      cell.isNameCell = false
      cell.targetFillProgress = 0
    })
    this.nameCells.clear()
    this.words = []

    if (!name || !this.cells.length || !this.cells[0].length) return

    const words = name.split(' ').filter(word => word.length > 0)
    const maxCharsPerLine = Math.floor(this.cells[0].length * 0.6)
    
    let currentY = Math.floor(this.cells.length / 2) - Math.floor((words.length * 7) / 2)
    let wordDelay = 0

    words.forEach(word => {
      const wordCells: GridCell[] = []
      const wordWidth = word.split('').reduce((width, char) => {
        const pattern = this.PATTERNS[char.toUpperCase() as keyof typeof this.PATTERNS] || this.PATTERNS[' ']
        return width + pattern[0].length
      }, 0) + word.length - 1

      const startX = Math.floor(this.cells[0].length / 2) - Math.floor(wordWidth / 2)

      let letterX = startX
      word.toUpperCase().split('').forEach(char => {
        const pattern = this.PATTERNS[char as keyof typeof this.PATTERNS] || this.PATTERNS[' ']
        
        pattern.forEach((row, i) => {
          row.forEach((value, j) => {
            if (value === 1) {
              const cellY = currentY + i
              const cellX = letterX + j

              if (cellY >= 0 && 
                  cellY < this.cells.length && 
                  cellX >= 0 && 
                  cellX < this.cells[0].length) {
                const cell = this.cells[cellY][cellX]
                cell.isNameCell = true
                cell.targetFillProgress = 0
                this.nameCells.add(cell)
                wordCells.push(cell)
              }
            }
          })
        })

        letterX += pattern[0].length + 1
      })

      this.words.push({ cells: wordCells, delay: wordDelay })
      wordDelay += 300
      currentY += 7
    })

    this.animationStartTime = performance.now()
  }

  render(time: number, mousePosition: { x: number; y: number }, userName: string): void {
    const mx = mousePosition?.x ?? 0
    const my = mousePosition?.y ?? 0

    const worldMouseX = mx - this.container.x
    const worldMouseY = my - this.container.y

    const elapsed = performance.now() - this.animationStartTime
    this.words.forEach(({ cells, delay }) => {
      if (elapsed > delay) {
        const wordProgress = Math.min(1, (elapsed - delay) / 500)
        cells.forEach(cell => {
          cell.targetFillProgress = wordProgress
        })
      }
    })

    for (const row of this.cells) {
      for (const cell of row) {
        cell.update(time * 0.01, worldMouseX, worldMouseY)
      }
    }
  }

  resize(width: number, height: number): void {
    this.createGrid()
  }
}
