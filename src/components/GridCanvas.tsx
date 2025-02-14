import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { useStore } from '../store'
import { GridSystem } from '../systems/GridSystem'

export const GridCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application>()
  const gridSystemRef = useRef<GridSystem>()
  const mousePosition = useStore(state => state.mousePosition)
  const userName = useStore(state => state.userName)

  useEffect(() => {
    if (!containerRef.current) return

    // Create PIXI Application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x0a0a0a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })

    containerRef.current.appendChild(app.view as unknown as Node)
    appRef.current = app

    // Initialize GridSystem
    const gridSystem = new GridSystem(app)
    gridSystemRef.current = gridSystem

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      if (gridSystemRef.current) {
        gridSystemRef.current.render(performance.now(), mousePosition, userName)
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight)
      if (gridSystemRef.current) {
        gridSystemRef.current.resize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      app.destroy(true)
    }
  }, [])

  // Handle userName changes
  useEffect(() => {
    if (gridSystemRef.current && userName) {
      gridSystemRef.current.displayName(userName)
    }
  }, [userName])

  return <div ref={containerRef} className="absolute inset-0" />
}
