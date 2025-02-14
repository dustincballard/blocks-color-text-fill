import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { useStore } from '../store'
import { ParticleSystem } from '../systems/ParticleSystem'

export const ParticleCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application>()
  const particleSystemRef = useRef<ParticleSystem>()
  const mousePosition = useStore(state => state.mousePosition)

  useEffect(() => {
    if (!containerRef.current) return

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
    })

    containerRef.current.appendChild(app.view as unknown as Node)
    appRef.current = app

    const particleSystem = new ParticleSystem(app)
    particleSystemRef.current = particleSystem

    app.ticker.add(() => {
      particleSystem.update(mousePosition)
    })

    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight)
      particleSystem.resize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      app.destroy(true)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}
