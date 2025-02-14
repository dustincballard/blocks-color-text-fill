import * as PIXI from 'pixi.js'

const fragmentShader = `
precision mediump float;
uniform float uTime;
uniform vec2 uMouse;

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(800.0, 600.0);
  vec2 mouse = uMouse;
  
  float dist = length(uv - mouse);
  float wave = sin(dist * 10.0 - uTime) * 0.5 + 0.5;
  
  vec3 color = vec3(wave * 0.5, wave * 0.8, wave);
  gl_FragColor = vec4(color, 1.0);
}
`

export const initShaders = (app: PIXI.Application) => {
  const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition',
      [-1, -1,
        1, -1,
        1,  1,
       -1,  1],
      2)
    .addIndex([0, 1, 2, 0, 2, 3])

  const shader = PIXI.Shader.from(`
    precision mediump float;
    attribute vec2 aVertexPosition;
    void main() {
      gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    }
  `, fragmentShader)

  const quad = new PIXI.Mesh(geometry, shader)
  app.stage.addChild(quad)

  return shader
}
