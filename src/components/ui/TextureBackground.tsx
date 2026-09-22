'use client';

import { useEffect, useRef } from 'react';

interface TextureProps {
  mode?: 'dark' | 'light';
  opacity?: number;
  className?: string;
}

export default function TextureBackground({
  mode = 'dark',
  opacity = 0.85,
  className = '',
}: TextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth / 3);
      canvas.height = Math.floor(window.innerHeight / 3);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vsSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform float u_opacity;
      uniform vec3 u_color_bg;
      uniform vec3 u_color_fg;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amt = 0.5;
        for (int i = 0; i < 3; i++) {
          v += amt * noise(p);
          p *= 2.05;
          amt *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = v_uv * 2.5;
        vec2 q = vec2(0.0);
        q.x = fbm(st + u_time * 0.03);
        q.y = fbm(st + vec2(1.0));
        vec2 r = vec2(0.0);
        r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + u_time * 0.02);
        r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + u_time * 0.015);
        float f = fbm(st + r);
        vec3 color = mix(u_color_bg, u_color_fg, clamp(f * f * 2.2, 0.0, 1.0));
        gl_FragColor = vec4(color, u_opacity);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const opacityLoc = gl.getUniformLocation(program, 'u_opacity');
    const bgLoc = gl.getUniformLocation(program, 'u_color_bg');
    const fgLoc = gl.getUniformLocation(program, 'u_color_fg');

    // Punk red/black and paper tones
    let colorBg = [0.03, 0.03, 0.03];
    let colorFg = [0.08, 0.04, 0.04]; // Subtle hint of punk crimson in the dark grain

    if (mode === 'light') {
      colorBg = [0.96, 0.94, 0.91]; // Warm fibrous paper
      colorFg = [0.89, 0.86, 0.82];
    }

    gl.uniform3fv(bgLoc, colorBg);
    gl.uniform3fv(fgLoc, colorFg);
    gl.uniform1f(opacityLoc, opacity);

    let rafId: number;
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [mode, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      className={className}
    />
  );
}
