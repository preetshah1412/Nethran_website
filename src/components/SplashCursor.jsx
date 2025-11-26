import React, { useEffect, useRef } from 'react';

function SplashCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0.97,
      VELOCITY_DISSIPATION: 0.98,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 0.35,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLORFUL: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
    };

    let pointer = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      down: false,
      moved: false,
      color: { r: 0, g: 0, b: 0.5 } // Dark Blue (Further reduced brightness)
    };

    let gl = canvas.getContext('webgl2', { alpha: true });
    const ext = {
      formatRGBA: null,
      formatRG: null,
      formatR: null,
      halfFloatTexType: null,
      supportLinearFiltering: null,
    };

    if (!gl) {
      gl = canvas.getContext('webgl', { alpha: true });
      ext.formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType(gl));
      ext.formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType(gl));
      ext.formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType(gl));
    } else {
      ext.formatRGBA = getSupportedFormat(gl, gl.RGBA8, gl.RGBA, halfFloatTexType(gl));
      ext.formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType(gl));
      ext.formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType(gl));
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      try {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // Guard against invalid format/type combos which may throw or generate GL errors
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        // cleanup
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return status === gl.FRAMEBUFFER_COMPLETE;
      } catch (err) {
        // If an exception occurs, this combination is not supported
        return false;
      }
    }

    function halfFloatTexType(gl) {
      // Prefer half-float when available and renderable; otherwise fall back to UNSIGNED_BYTE.
      try {
        // WebGL2 has builtin support for HALF_FLOAT as a type when extensions present
        if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
          // Try EXT_color_buffer_half_float or EXT_color_buffer_float for renderable half/float
          const extHalf = gl.getExtension('EXT_color_buffer_half_float') || gl.getExtension('EXT_color_buffer_float');
          if (extHalf) {
            return gl.HALF_FLOAT || (extHalf.HALF_FLOAT_OES || gl.HALF_FLOAT);
          }
          // fallback to UNSIGNED_BYTE on WebGL2
          return gl.UNSIGNED_BYTE;
        } else {
          // WebGL1: check for OES_texture_half_float + WEBGL_color_buffer_float/EXT_color_buffer_half_float
          const halfExt = gl.getExtension('OES_texture_half_float');
          const floatExt = gl.getExtension('OES_texture_float');
          const colorBufferFloat = gl.getExtension('WEBGL_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float') || gl.getExtension('EXT_color_buffer_float');
          if (halfExt && colorBufferFloat) return halfExt.HALF_FLOAT_OES;
          if (floatExt && colorBufferFloat) return gl.FLOAT;
          // last resort: UNSIGNED_BYTE
          return gl.UNSIGNED_BYTE;
        }
      } catch (e) {
        return gl.UNSIGNED_BYTE;
      }
    }

    // Shaders
    const baseVertexShader = compileShader(gl, gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const clearShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `);

    const colorShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform vec4 color;
      void main () {
        gl_FragColor = color;
      }
    `);

    const backgroundShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      uniform vec3 color;
      void main () {
        gl_FragColor = vec4(color, 1.0);
      }
    `);

    const displayShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        vec3 C = texture2D(uTexture, vUv).rgb;
        float a = max(C.r, max(C.g, C.b));
        gl_FragColor = vec4(C, a);
      }
    `);

    const splatShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `);

    const divergenceShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    function compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    let programs = {
      clear: createProgram(gl, baseVertexShader, clearShader),
      color: createProgram(gl, baseVertexShader, colorShader),
      background: createProgram(gl, baseVertexShader, backgroundShader),
      display: createProgram(gl, baseVertexShader, displayShader),
      splat: createProgram(gl, baseVertexShader, splatShader),
      advection: createProgram(gl, baseVertexShader, advectionShader),
      divergence: createProgram(gl, baseVertexShader, divergenceShader),
      curl: createProgram(gl, baseVertexShader, curlShader),
      vorticity: createProgram(gl, baseVertexShader, vorticityShader),
      pressure: createProgram(gl, baseVertexShader, pressureShader),
      gradientSubtract: createProgram(gl, baseVertexShader, gradientSubtractShader),
    };

    function createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
      }
      return program;
    }

    let simWidth, simHeight, dyeWidth, dyeHeight;
    let density, velocity, divergence, curl, pressure;
    let initialized = false;

    function initFramebuffers() {
      let simRes = getResolution(config.SIM_RESOLUTION);
      let dyeRes = getResolution(config.DYE_RESOLUTION);

      simWidth = simRes.width;
      simHeight = simRes.height;
      dyeWidth = dyeRes.width;
      dyeHeight = dyeRes.height;

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;

      if (!rgba || !rg || !r) {
        console.warn('SplashCursor: Required texture formats not supported.');
        return;
      }

      density = createDoubleFBO(gl, dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, texType, gl.LINEAR);
      velocity = createDoubleFBO(gl, simWidth, simHeight, rg.internalFormat, rg.format, texType, gl.LINEAR);
      divergence = createFBO(gl, simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
      curl = createFBO(gl, simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(gl, simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);

      initialized = true;
    }

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      let min = Math.round(resolution);
      let max = Math.round(resolution * aspectRatio);
      if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min };
      else
        return { width: min, height: max };
    }

    function createFBO(gl, w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }

    function createDoubleFBO(gl, w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(gl, w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(gl, w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        get read() { return fbo1; },
        set read(value) { fbo1 = value; },
        get write() { return fbo2; },
        set write(value) { fbo2 = value; },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    }

    function updateKeywords() {
      let displayKeywords = [];
      if (config.SHADING) displayKeywords.push("SHADING");
    }

    updateKeywords();
    initFramebuffers();

    let lastTime = Date.now();
    let colorIndex = 0;

    function update() {
      if (!initialized) return;
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      gl.viewport(0, 0, simWidth, simHeight);

      // Advection
      gl.useProgram(programs.advection);
      gl.uniform2f(gl.getUniformLocation(programs.advection, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uVelocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uSource'), velocity.read.attach(1));
      gl.uniform1f(gl.getUniformLocation(programs.advection, 'dt'), dt);
      gl.uniform1f(gl.getUniformLocation(programs.advection, 'dissipation'), config.VELOCITY_DISSIPATION);
      blit(gl, velocity.write.fbo);
      velocity.swap();

      gl.useProgram(programs.advection);
      gl.uniform2f(gl.getUniformLocation(programs.advection, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uVelocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.advection, 'uSource'), density.read.attach(1));
      gl.uniform1f(gl.getUniformLocation(programs.advection, 'dissipation'), config.DENSITY_DISSIPATION);
      blit(gl, density.write.fbo);
      density.swap();

      // Splat
      if (pointer.moved) {
        gl.useProgram(programs.splat);
        gl.uniform1i(gl.getUniformLocation(programs.splat, 'uTarget'), velocity.read.attach(0));
        gl.uniform1f(gl.getUniformLocation(programs.splat, 'aspectRatio'), canvas.width / canvas.height);
        gl.uniform2f(gl.getUniformLocation(programs.splat, 'point'), pointer.x, 1.0 - pointer.y);
        gl.uniform3f(gl.getUniformLocation(programs.splat, 'color'), pointer.dx, -pointer.dy, 1.0);
        gl.uniform1f(gl.getUniformLocation(programs.splat, 'radius'), config.SPLAT_RADIUS / 100.0);
        blit(gl, velocity.write.fbo);
        velocity.swap();

        gl.useProgram(programs.splat);
        gl.uniform1i(gl.getUniformLocation(programs.splat, 'uTarget'), density.read.attach(0));
        gl.uniform3f(gl.getUniformLocation(programs.splat, 'color'), pointer.color.r, pointer.color.g, pointer.color.b);
        blit(gl, density.write.fbo);
        density.swap();

        pointer.moved = false;
      }

      // Curl
      gl.useProgram(programs.curl);
      gl.uniform2f(gl.getUniformLocation(programs.curl, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.curl, 'uVelocity'), velocity.read.attach(0));
      blit(gl, curl.fbo);

      // Vorticity
      gl.useProgram(programs.vorticity);
      gl.uniform2f(gl.getUniformLocation(programs.vorticity, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.vorticity, 'uVelocity'), velocity.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.vorticity, 'uCurl'), curl.attach(1));
      gl.uniform1f(gl.getUniformLocation(programs.vorticity, 'curl'), config.CURL);
      gl.uniform1f(gl.getUniformLocation(programs.vorticity, 'dt'), dt);
      blit(gl, velocity.write.fbo);
      velocity.swap();

      // Divergence
      gl.useProgram(programs.divergence);
      gl.uniform2f(gl.getUniformLocation(programs.divergence, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.divergence, 'uVelocity'), velocity.read.attach(0));
      blit(gl, divergence.fbo);

      // Pressure
      gl.useProgram(programs.clear);
      gl.uniform1i(gl.getUniformLocation(programs.clear, 'uTexture'), pressure.read.attach(0));
      gl.uniform1f(gl.getUniformLocation(programs.clear, 'value'), config.PRESSURE_ITERATIONS);
      blit(gl, pressure.write.fbo);
      pressure.swap();

      gl.useProgram(programs.pressure);
      gl.uniform2f(gl.getUniformLocation(programs.pressure, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.pressure, 'uDivergence'), divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(gl.getUniformLocation(programs.pressure, 'uPressure'), pressure.read.attach(1));
        blit(gl, pressure.write.fbo);
        pressure.swap();
      }

      // Gradient Subtract
      gl.useProgram(programs.gradientSubtract);
      gl.uniform2f(gl.getUniformLocation(programs.gradientSubtract, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gl.getUniformLocation(programs.gradientSubtract, 'uPressure'), pressure.read.attach(0));
      gl.uniform1i(gl.getUniformLocation(programs.gradientSubtract, 'uVelocity'), velocity.read.attach(1));
      blit(gl, velocity.write.fbo);
      velocity.swap();

      // Display
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.useProgram(programs.display);
      gl.uniform1i(gl.getUniformLocation(programs.display, 'uTexture'), density.read.attach(0));
      blit(gl, null);

      requestAnimationFrame(update);
    }

    function blit(gl, fbo) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      initFramebuffers();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.addEventListener('mousemove', e => {
      pointer.moved = true;
      pointer.dx = (e.clientX - pointer.x * window.innerWidth) * 5.0;
      pointer.dy = (e.clientY - pointer.y * window.innerHeight) * 5.0;
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    });

    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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
        zIndex: 9999,
        mixBlendMode: 'screen'
      }}
    />
  );
}

export default SplashCursor;
