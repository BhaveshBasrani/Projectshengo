'use client';

import React, { useEffect, useRef } from 'react';

export interface HalftoneFlowProps {
  className?: string;
  opacity?: number;
  speed?: number;
  gridSize?: number;
}

/**
 * Custom Punk Halftone Flow WebGL Canvas
 * Renders an authentic, fluid halftone dot matrix with rich Project S.H.E. crimson tones.
 * Darker, moodier, high-contrast, zero external script dependencies.
 */
export default function HalftoneFlow({
  className = '',
  opacity = 0.45,
  speed = 0.3,
  gridSize = 6.5,
}: HalftoneFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });

    if (!gl) return;

    let animationId: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Vertex Shader
    const vsSource = `
      attribute vec2 aVertexPosition;
      void main() {
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Authentic Mechanical Rotary Press Halftone & Film Grain Screen (Non-AI)
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_grid;

      // Analog high-frequency grain hash for authentic physical printing press texture
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;

        // Mechanical 45-degree angle standard offset litho screen
        vec2 screen_p = rot(0.785398) * gl_FragCoord.xy; // 45 deg

        // Physical film grain & ink texture
        float grain = hash(gl_FragCoord.xy + fract(u_time * 0.05) * 100.0) * 0.18;

        // Slow subtle analog exposure drift (non-AI, purely photographic/mechanical)
        float t = u_time * ${speed.toFixed(2)} * 0.4;
        float exposure = sin(uv.x * 1.5 + t * 0.4) * cos(uv.y * 1.2 - t * 0.3) * 0.25 + 0.5;
        exposure += grain * 0.35;

        // Radial focus keeping text area clean and right-side emblem balanced
        float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - vec2(0.7, 0.4)));
        exposure *= vignette;

        // Offset printing halftone dot screen
        float grid = u_grid;
        vec2 cell = fract(screen_p / grid) - 0.5;
        float dist = length(cell);

        // Dot size derived from analog ink exposure
        float dot_radius = clamp(exposure * 0.48, 0.04, 0.46);
        float dot = smoothstep(dot_radius, dot_radius - 0.1, dist);

        // Authentic Project S.H.E. Industrial Crimson Ink
        vec3 ink_color = vec3(0.9, 0.1, 0.17); // #E6192B

        // Output with organic alpha so background UK broadsheet is visible
        float alpha = dot * (0.35 + exposure * 0.45);
        gl_FragColor = vec4(ink_color * dot, alpha * 0.7);
      }
    `;

    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positions = new Float32Array([
      -1.0, 1.0,
       1.0, 1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const gridLocation = gl.getUniformLocation(program, 'u_grid');

    const startTime = performance.now();

    function render() {
      if (!gl || !canvas) return;
      resize();
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (performance.now() - startTime) / 1000.0);
      gl.uniform1f(gridLocation, gridSize);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [speed, gridSize]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ background: 'transparent' }}
      />
      {/* Top and bottom subtle dark gradient masks to blend seamlessly with the section */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-[#080808]/40 pointer-events-none" />
    </div>
  );
}
