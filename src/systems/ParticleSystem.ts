import * as PIXI from 'pixi.js'
import { vec2 } from 'gl-matrix'

class Particle extends PIXI.Graphics {
  velocity: vec2
  acceleration: vec2
  life: number
  maxLife: number
  
  constructor() {
    super()
    this.velocity = vec2.fromValues(0, 0)
    this.acceleration = vec2.fromValues(0, 0)
    this.life = 1
    this.maxLife = 1
  }

  update() {
    vec2.add(this.velocity, this.velocity, this.acceleration)
    this.x += this.velocity[0]
    this.y += this.velocity[1]
    this.life -= 0.01
    
    const scale = this.life / this.maxLife
    this.scale.set(scale)
    this.alpha = scale
  }
}

export class ParticleSystem {
  app: PIXI.Application
  particles: Particle[]
  container: PIXI.Container
  width: number
  height: number

  constructor(app: PIXI.Application) {
    this.app = app
    this.particles = []
    this.container = new PIXI.Container()
    this.width = app.screen.width
    this.height = app.screen.height
    
    app.stage.addChild(this.container)
    this.createInitialParticles()
  }

  createInitialParticles() {
    for (let i = 0; i < 100; i++) {
      this.createParticle(
        Math.random() * this.width,
        Math.random() * this.height
      )
    }
  }

  createParticle(x: number, y: number) {
    const particle = new Particle()
    
    particle.beginFill(0x646cff)
    particle.drawCircle(0, 0, 4)
    particle.endFill()
    
    particle.x = x
    particle.y = y
    particle.life = 1
    particle.maxLife = 1
    
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 2
    vec2.set(
      particle.velocity,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    )
    
    this.particles.push(particle)
    this.container.addChild(particle)
  }

  update(mousePosition: { x: number; y: number }) {
    // Remove dead particles
    this.particles = this.particles.filter(particle => {
      if (particle.life <= 0) {
        this.container.removeChild(particle)
        return false
      }
      return true
    })

    // Create new particles at mouse position
    if (mousePosition.x && mousePosition.y) {
      for (let i = 0; i < 2; i++) {
        this.createParticle(
          mousePosition.x + (Math.random() - 0.5) * 20,
          mousePosition.y + (Math.random() - 0.5) * 20
        )
      }
    }

    // Update existing particles
    this.particles.forEach(particle => {
      // Add some turbulence
      vec2.set(
        particle.acceleration,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      )
      
      particle.update()
    })
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
  }
}
