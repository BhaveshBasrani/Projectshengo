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

    // Fragment Shader: Custom Punk Red Halftone Fluid Flow
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_grid;

      mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        vec2 flow_uv = p;
        float time = u_time * ${speed.toFixed(2)};

        // Fluid distortion waves
        for(float i = 1.0; i < 4.0; i++) {
          flow_uv *= rot(time * 0.06);
          flow_uv.x += sin(flow_uv.y * 1.8 * i + time) * 0.45;
          flow_uv.y += cos(flow_uv.x * 1.4 * i - time * 0.75) * 0.45;
        }

        float intensity = sin(flow_uv.x * 2.2 + flow_uv.y * 3.0) * 0.5 + 0.5;

        // Project S.H.E. Dark Punk Blood Palette
        vec3 col_abyss = vec3(0.005, 0.0, 0.002);
        vec3 col_deep_red = vec3(0.55, 0.02, 0.04);
        vec3 col_punk_red = vec3(0.92, 0.035, 0.08); // #E50914 Crimson

        // Rich dark-to-blood red fluid gradients
        vec3 fluid_color = mix(col_abyss, col_deep_red, smoothstep(0.15, 0.55, intensity));
        fluid_color = mix(fluid_color, col_punk_red, smoothstep(0.55, 0.95, intensity));

        // Zine Screen Halftone Dot Raster
        float grid = u_grid;
        vec2 grid_uv = gl_FragCoord.xy / grid;
        vec2 cell_uv = fract(grid_uv) - 0.5;

        float dist = length(cell_uv);
        float radius = intensity * 0.44;
        float dot_mask = smoothstep(radius, radius - 0.12, dist);

        // Halftone dots with subtle ambient back-glow
        vec3 final_color = mix(col_abyss, fluid_color, dot_mask);
        final_color += fluid_color * 0.14;

        gl_FragColor = vec4(final_color, 1.0);
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
        style={{ background: '#000000' }}
      />
      {/* Top and bottom subtle dark gradient masks to blend seamlessly with the section */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-[#080808]/50 pointer-events-none" />
    </div>
  );
}
