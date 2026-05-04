'use client'

import { useEffect, useRef } from 'react'

interface Props {
  color?: [number, number, number]
  opacity?: number
  speed?: number
}

export default function NeuralNoise({
  color = [0.08, 0.20, 0.65],
  opacity = 0.85,
  speed = 0.0006,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return

    const pointer = { x: 0, y: 0, tX: 0.5, tY: 0.5 }
    let rafId: number

    // ── Shaders ──────────────────────────────────────────────
    const vsSource = `
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform vec3 u_color;
      uniform float u_speed;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.0);
          sine_acc = rotate(sine_acc, 1.0);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = 0.5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0);
        float t = u_speed * u_time;
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= (1.0 - length(vUv - 0.5));
        vec3 col = u_color * noise;
        gl_FragColor = vec4(col, noise);
      }
    `

    // ── Helpers ───────────────────────────────────────────────
    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type)!
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader)
        return null
      }
      return shader
    }

    function getUniforms(program: WebGLProgram) {
      const out: Record<string, WebGLUniformLocation> = {}
      const n = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS)
      for (let i = 0; i < n; i++) {
        const name = gl!.getActiveUniform(program, i)!.name
        out[name] = gl!.getUniformLocation(program, name)!
      }
      return out
    }

    // ── Program setup ─────────────────────────────────────────
    const vs = createShader(gl.VERTEX_SHADER, vsSource)
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) return

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    const uniforms = getUniforms(program)
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.useProgram(program)
    const pos = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    gl.uniform3f(uniforms.u_color, color[0], color[1], color[2])
    gl.uniform1f(uniforms.u_speed, speed)

    // ── Resize ────────────────────────────────────────────────
    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      gl!.uniform1f(uniforms.u_ratio, canvas.width / canvas.height)
      gl!.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Render loop ───────────────────────────────────────────
    function render() {
      pointer.x += (pointer.tX - pointer.x) * 0.05
      pointer.y += (pointer.tY - pointer.y) * 0.05
      gl!.uniform1f(uniforms.u_time, performance.now())
      gl!.uniform2f(uniforms.u_pointer_position, pointer.x, 1 - pointer.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(render)
    }
    render()

    // ── Events ────────────────────────────────────────────────
    const onMove = (x: number, y: number) => {
      pointer.tX = x / window.innerWidth
      pointer.tY = y / window.innerHeight
    }
    const onPointer = (e: PointerEvent) => onMove(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      if (e.targetTouches[0]) onMove(e.targetTouches[0].clientX, e.targetTouches[0].clientY)
    }
    const onClick = (e: MouseEvent) => onMove(e.clientX, e.clientY)

    window.addEventListener('pointermove', onPointer)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('click', onClick)
    }
  }, [color, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
      }}
    />
  )
}