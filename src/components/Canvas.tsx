import { forwardRef, useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { useStore } from '../store'
import { initShaders } from '../shaders'

export const Canvas = forwardRef<HTMLCanvasElement>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application>()
  const mousePosition = useStore(state => state.mousePosition)

  useEffect(() => {
    if (!containerRef.current) return

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1a1a1a,
      antialias: true,
    })

    containerRef.current.appendChild(app.view as unknown as Node)
    appRef.current = app

    const shader = initShaders(app)
    
    const animate = () => {
      shader.uniforms.uTime = performance.now() / 1000
      shader.uniforms.uMouse = [
        mousePosition.x / window.innerWidth,
        1 - mousePosition.y / window.innerHeight
      ]
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      app.destroy(true)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0" />
  )
})
