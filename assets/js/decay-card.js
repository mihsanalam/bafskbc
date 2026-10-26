/**
 * IITian Tattva - DecayCard Interactive Digital Identity Card
 * 
 * High-performance WebGL2 shader component based on ReactBits DecayCard.
 * Features:
 * - Real-time GPU organic displacement tearing/decay upon cursor movement
 * - Elastic decay recovery with physics damping
 * - 3D card tilt & parallax
 * - Dynamic texture reloading for photo changes
 * - Interactive GitHub & LinkedIn bottom-left icons
 * - Zero external framework dependencies; pure WebGL2 + canvas
 */

(function (window) {
  'use strict';

  const BLEED = 1.24;

  const VERTEX_SHADER = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec2 uSize;
uniform vec2 uImageSize;
uniform float uUnit;
uniform float uScale;
uniform float uIdle;
uniform float uFrequency;
uniform int uOctaves;
uniform float uSeed;
uniform float uRadius;
uniform float uTime;
uniform float uFlow;
uniform float uChroma;
uniform float uGray;
uniform float uReady;
in vec2 vUv;
out vec4 fragColor;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n = 1.0 / 7.0;
  vec3 ns = n * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float turbulence(vec2 p, float z) {
  float sum = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) break;
    sum += abs(snoise(vec3(p, z))) * amp;
    p = p * 2.0 + 19.19;
    amp *= 0.5;
  }
  return clamp(sum * 0.45 + 0.231, 0.0, 1.0);
}

float roundedBox(vec2 p, vec2 extent, float r) {
  vec2 q = abs(p) - extent + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 sampleImage(vec2 view) {
  vec2 uv = view / vec2(600.0, 750.0);
  float card = 600.0 / 750.0;
  float imageRatio = uImageSize.x / max(1.0, uImageSize.y);
  vec2 scale = card > imageRatio ? vec2(1.0, imageRatio / card) : vec2(card / imageRatio, 1.0);
  return texture(uImage, (uv - 0.5) * scale + 0.5).rgb;
}

void main() {
  vec2 view = vec2(300.0, 375.0) + (vUv * uSize - uSize * 0.5) / uUnit;
  float inside = min(min(view.x, 600.0 - view.x), min(view.y, 750.0 - view.y));
  float rim = 1.0 - smoothstep(0.0, 160.0, inside);
  float drift = snoise(vec3(view * 0.004 + uSeed * 0.37, uTime * 0.12)) * 0.5 + 0.5;
  float idle = uIdle * mix(smoothstep(0.55, 0.95, drift) * 0.5, 0.25 + 0.75 * smoothstep(0.3, 0.8, drift), rim);
  float scale = uScale * mix(0.2, 1.0, rim) + idle * 120.0;
  vec2 offset = vec2(0.0);
  if (scale > 0.01) {
    vec2 p = view * uFrequency + vec2(uSeed * 17.31, uSeed * 9.17);
    float z = uTime * (uFlow * 0.35 + uIdle * 0.5) + uSeed * 3.1;
    float red = turbulence(p, z);
    float blue = turbulence(p + vec2(31.7, 47.3), z + 5.3);
    offset = scale * (vec2(red, blue) - 0.5);
  }
  vec2 source = view + offset;
  float edge = roundedBox(source - vec2(300.0, 375.0), vec2(300.0, 375.0), uRadius);
  float alpha = (1.0 - smoothstep(-0.75 / uUnit, 0.75 / uUnit, edge)) * uReady;
  vec3 color = sampleImage(source);
  if (uChroma > 0.0) {
    vec2 split = offset * uChroma * 0.08 + vec2(uChroma * min(scale, 200.0) * 0.012, 0.0);
    color.r = sampleImage(source + split).r;
    color.b = sampleImage(source - split).b;
  }
  color = mix(color, vec3(dot(color, vec3(0.2126, 0.7152, 0.0722))), uGray);
  fragColor = vec4(color * alpha, alpha);
}`;

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const soften = (value, bound) => {
    if (value > bound) return bound + (value - bound) * 0.2;
    if (value < -bound) return -bound + (value + bound) * 0.2;
    return value;
  };

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  class DecayCard {
    constructor(containerEl, options = {}) {
      if (!containerEl) throw new Error('DecayCard: container element is required');
      this.container = containerEl;
      this.options = Object.assign({
        image: 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop',
        fallbackImage: 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop',
        intensity: 0.5,
        sensitivity: 0.5,
        hoverDecay: 0.05,
        recovery: 0.6,
        idle: 0.35,
        grain: 0.25,
        detail: 5,
        pattern: 4,
        flow: 0,
        chroma: 0,
        travel: 50,
        tilt: 10,
        scope: 'window',
        radius: 0,
        grayscale: false,
        name: 'IITian Member',
        email: '',
        program: 'BS in Data Science & Applications',
        academicLevel: 'Foundation Level',
        github: '',
        linkedin: '',
        leetcode: ''
      }, options);

      this.alive = true;
      this.raf = 0;
      this.gl = null;
      this.program = null;
      this.texture = null;
      this.uniforms = {};

      this.settings = {
        intensity: clamp(this.options.intensity, 0, 2),
        sensitivity: clamp(this.options.sensitivity, 0, 1),
        hoverDecay: clamp(this.options.hoverDecay, 0, 1),
        recovery: Math.max(0.05, this.options.recovery),
        frequency: 0.003 + clamp(this.options.grain, 0, 1) * 0.047,
        octaves: clamp(Math.round(this.options.detail), 1, 8),
        seed: Math.round(this.options.pattern),
        idle: clamp(this.options.idle, 0, 1),
        flow: clamp(this.options.flow, 0, 2),
        chroma: clamp(this.options.chroma, 0, 2),
        travel: Math.max(0, this.options.travel),
        tilt: clamp(this.options.tilt, 0, 45),
        scope: this.options.scope === 'card' ? 'card' : 'window',
        radius: Math.max(0, this.options.radius),
        grayscale: !!this.options.grayscale
      };

      this.state = {
        x: 0,
        y: 0,
        rotate: 0,
        level: 0,
        time: 0,
        cursorX: window.innerWidth / 2,
        cursorY: window.innerHeight / 2,
        lastX: window.innerWidth / 2,
        lastY: window.innerHeight / 2,
        seen: false,
        hovered: false,
        visible: true,
        ready: false,
        imageWidth: 1,
        imageHeight: 1
      };

      this.buildDOM();
      this.initWebGL();
      this.bindEvents();
      this.loadImage(this.options.image);
    }

    buildDOM() {
      this.container.innerHTML = `
        <div class="decay-card-root" id="decayCardRoot">
          <!-- Fallback image (shown if WebGL fails) -->
          <img class="decay-card-fallback-img" id="decayCardFallbackImg" src="${this.options.image || this.options.fallbackImage}" alt="${this.escapeHtml(this.options.name)}" style="display: none;" />

          <!-- WebGL2 displacement canvas -->
          <canvas class="decay-card-canvas" id="decayCardCanvas"></canvas>

          <!-- Gradient scrim for typography contrast -->
          <div class="decay-card-scrim" aria-hidden="true"></div>

          <!-- Topbar with IITian Tattva badge -->
          <div class="decay-card-topbar">
            <div class="decay-card-badge">
              <span class="decay-card-badge-dot"></span>
              <span>IIT MADRAS BS</span>
            </div>
            <div class="decay-card-logo-tag">TATTVA</div>
          </div>

          <!-- Bottom profile information -->
          <div class="decay-card-content">
            <div class="decay-card-program">
              <svg class="decay-card-program-icon" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 1.5l6.5 3.5-6.5 3.5L1.5 5 8 1.5zM3 7.5v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4"/>
              </svg>
              <span id="decayCardProgramText">${this.escapeHtml(this.options.program || 'BS in Data Science & Applications')}</span>
            </div>
            <h3 class="decay-card-name" id="decayCardName">${this.escapeHtml(this.options.name)}</h3>
            <div class="decay-card-email" id="decayCardEmail">${this.escapeHtml(this.options.email || '')}</div>
            <span class="decay-card-level-badge" id="decayCardLevelText">${this.escapeHtml(this.options.academicLevel || 'Member')}</span>

            <!-- Bottom footer: Social icons on bottom-left -->
            <div class="decay-card-footer">
              <div class="decay-card-social-links" id="decayCardSocialLinks">
                <a
                  href="${this.options.github ? this.escapeHtml(this.options.github) : '#'}"
                  class="decay-card-social-btn ${!this.options.github ? 'disabled' : ''}"
                  id="decayCardGithubBtn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  title="${this.options.github ? 'View GitHub Profile' : 'No GitHub link provided'}"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="${this.options.linkedin ? this.escapeHtml(this.options.linkedin) : '#'}"
                  class="decay-card-social-btn ${!this.options.linkedin ? 'disabled' : ''}"
                  id="decayCardLinkedinBtn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  title="${this.options.linkedin ? 'View LinkedIn Profile' : 'No LinkedIn link provided'}"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="${this.options.leetcode ? this.escapeHtml(this.options.leetcode) : '#'}"
                  class="decay-card-social-btn ${!this.options.leetcode ? 'disabled' : ''}"
                  id="decayCardLeetcodeBtn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                  title="${this.options.leetcode ? 'View LeetCode Profile' : 'No LeetCode link provided'}"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.559 5.88 5.88 0 0 0 2.457-.146 5.73 5.73 0 0 0 2.216-1.121l4.02-4.043a1.375 1.375 0 0 0 0-1.944 1.375 1.375 0 0 0-1.945 0l-4.019 4.043a3.02 3.02 0 0 1-1.185.602 3.09 3.09 0 0 1-1.309.076 3.197 3.197 0 0 1-2.6-1.921 2.97 2.97 0 0 1-.188-.549 3.04 3.04 0 0 1-.034-1.301 2.89 2.89 0 0 1 .665-1.157l3.854-4.126 5.406-5.788A1.375 1.375 0 0 0 13.483 0zm4.271 8.86a1.375 1.375 0 0 0-.972.403 1.375 1.375 0 0 0 0 1.944l2.458 2.473a1.375 1.375 0 0 1 0 1.944l-2.458 2.473a1.375 1.375 0 1 0 1.945 1.944l2.458-2.473a4.125 4.125 0 0 0 0-5.832l-2.458-2.473a1.375 1.375 0 0 0-.973-.46zM9.467 11.23a1.375 1.375 0 0 0-1.375 1.375 1.375 1.375 0 0 0 1.375 1.375h5.5a1.375 1.375 0 0 0 1.375-1.375 1.375 1.375 0 0 0-1.375-1.375z"/>
                  </svg>
                </a>
              </div>
              <span class="decay-card-hint">IITian Tattva</span>
            </div>
          </div>

          <div class="decay-card-rim" aria-hidden="true"></div>
        </div>
      `;

      this.rootEl = this.container.querySelector('#decayCardRoot');
      this.canvasEl = this.container.querySelector('#decayCardCanvas');
      this.fallbackImgEl = this.container.querySelector('#decayCardFallbackImg');

      // Stop social buttons from triggering card events
      const socialLinks = this.container.querySelectorAll('.decay-card-social-btn');
      socialLinks.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      });
    }

    initWebGL() {
      const gl = this.canvasEl.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });

      if (!gl) {
        this.showFallback();
        return;
      }
      this.gl = gl;

      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

      if (!vertexShader || !fragmentShader) {
        this.showFallback();
        return;
      }

      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.bindAttribLocation(program, 0, 'position');
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('DecayCard shader program link error:', gl.getProgramInfoLog(program));
        this.showFallback();
        return;
      }
      this.program = program;

      // Full screen quad buffer
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      // Texture
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      this.texture = texture;

      for (const name of [
        'uImage', 'uSize', 'uImageSize', 'uUnit', 'uScale', 'uIdle', 'uFrequency',
        'uOctaves', 'uSeed', 'uRadius', 'uTime', 'uFlow', 'uChroma', 'uGray', 'uReady'
      ]) {
        this.uniforms[name] = gl.getUniformLocation(program, name);
      }
    }

    showFallback() {
      if (this.fallbackImgEl) this.fallbackImgEl.style.display = 'block';
      if (this.canvasEl) this.canvasEl.style.display = 'none';
    }

    loadImage(src) {
      if (!src) {
        this.showFallback();
        return;
      }

      this.state.ready = false;
      if (this.fallbackImgEl) this.fallbackImgEl.src = src;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => {
        if (!this.alive) return;
        if (!this.gl || !this.program) {
          this.showFallback();
          return;
        }

        try {
          const gl = this.gl;
          gl.bindTexture(gl.TEXTURE_2D, this.texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);

          this.state.imageWidth = img.naturalWidth || 1;
          this.state.imageHeight = img.naturalHeight || 1;
          this.state.ready = true;
          if (this.fallbackImgEl) this.fallbackImgEl.style.display = 'none';
          if (this.canvasEl) this.canvasEl.style.display = 'block';
          this.draw();
          this.wake();
        } catch (e) {
          console.warn('Failed to upload image texture to WebGL:', e);
          this.showFallback();
        }
      };

      img.onerror = () => {
        console.warn('Failed to load image for DecayCard:', src);
        this.showFallback();
      };

      img.src = src;
    }

    draw() {
      const gl = this.gl;
      if (!gl || !this.program) return;

      const s = this.settings;
      const w = this.canvasEl.width;
      const h = this.canvasEl.height;
      if (!w || !h) return;

      const unit = Math.max(w / 720, h / 900) / BLEED;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);

      gl.uniform1i(this.uniforms.uImage, 0);
      gl.uniform2f(this.uniforms.uSize, w, h);
      gl.uniform2f(this.uniforms.uImageSize, this.state.imageWidth, this.state.imageHeight);
      gl.uniform1f(this.uniforms.uUnit, unit);
      gl.uniform1f(this.uniforms.uScale, this.state.level * s.intensity * 440);
      gl.uniform1f(this.uniforms.uIdle, s.idle);
      gl.uniform1f(this.uniforms.uFrequency, s.frequency);
      gl.uniform1i(this.uniforms.uOctaves, s.octaves);
      gl.uniform1f(this.uniforms.uSeed, s.seed);
      gl.uniform1f(this.uniforms.uRadius, Math.min(300, (s.radius * (w / Math.max(1, this.canvasEl.clientWidth))) / unit));
      gl.uniform1f(this.uniforms.uTime, this.state.time);
      gl.uniform1f(this.uniforms.uFlow, s.flow);
      gl.uniform1f(this.uniforms.uChroma, s.chroma);
      gl.uniform1f(this.uniforms.uGray, s.grayscale ? 1 : 0);
      gl.uniform1f(this.uniforms.uReady, this.state.ready ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    bindEvents() {
      this.lastTime = performance.now();
      this.calm = 0;
      this.tick = 0;

      const onPointerMove = (clientX, clientY) => {
        this.state.cursorX = clientX;
        this.state.cursorY = clientY;
        this.state.seen = true;
        this.wake();
      };

      this.onMouseMoveWindow = (e) => {
        if (this.settings.scope === 'window') {
          onPointerMove(e.clientX, e.clientY);
        }
      };

      this.onMouseMoveCard = (e) => {
        this.state.hovered = true;
        onPointerMove(e.clientX, e.clientY);
      };

      this.onMouseLeaveCard = () => {
        this.state.hovered = false;
        this.wake();
      };

      // Touch support
      this.onTouchMoveCard = (e) => {
        if (e.touches && e.touches[0]) {
          this.state.hovered = true;
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      this.onTouchEndCard = () => {
        this.state.hovered = false;
        this.wake();
      };

      window.addEventListener('mousemove', this.onMouseMoveWindow, { passive: true });
      this.rootEl.addEventListener('mousemove', this.onMouseMoveCard, { passive: true });
      this.rootEl.addEventListener('mouseleave', this.onMouseLeaveCard, { passive: true });
      this.rootEl.addEventListener('touchmove', this.onTouchMoveCard, { passive: true });
      this.rootEl.addEventListener('touchend', this.onTouchEndCard, { passive: true });

      // Resize observer
      this.resize = () => {
        if (!this.canvasEl) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(this.canvasEl.clientWidth * dpr));
        const h = Math.max(1, Math.round(this.canvasEl.clientHeight * dpr));
        if (this.canvasEl.width !== w || this.canvasEl.height !== h) {
          this.canvasEl.width = w;
          this.canvasEl.height = h;
        }
        this.draw();
      };

      window.addEventListener('resize', this.resize, { passive: true });
      setTimeout(this.resize, 50);

      // Start animation loop
      this.wake();
    }

    wake() {
      if (this.raf || !this.alive || !this.state.visible) return;
      this.calm = 0;
      this.lastTime = performance.now();
      this.raf = requestAnimationFrame((now) => this.frame(now));
    }

    frame(now) {
      this.raf = 0;
      if (!this.alive) return;

      const s = this.settings;
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.state.time += dt;

      const speed = Math.hypot(this.state.cursorX - this.state.lastX, this.state.cursorY - this.state.lastY) / dt;
      this.state.lastX = this.state.cursorX;
      this.state.lastY = this.state.cursorY;

      let nx = 0;
      let ny = 0;
      if (s.scope === 'card') {
        if (this.state.hovered) {
          const rect = this.rootEl.getBoundingClientRect();
          nx = clamp(((this.state.cursorX - rect.left) / Math.max(1, rect.width)) * 2 - 1, -1, 1);
          ny = clamp(((this.state.cursorY - rect.top) / Math.max(1, rect.height)) * 2 - 1, -1, 1);
        }
      } else if (this.state.seen) {
        nx = clamp((this.state.cursorX / Math.max(1, window.innerWidth)) * 2 - 1, -1, 1);
        ny = clamp((this.state.cursorY / Math.max(1, window.innerHeight)) * 2 - 1, -1, 1);
      }

      const follow = 1 - Math.exp(-dt / 0.16);
      const targetX = soften(nx * 120, s.travel);
      const targetY = soften(ny * 120, s.travel);
      const targetRotate = nx * s.tilt;

      this.state.x += (targetX - this.state.x) * follow;
      this.state.y += (targetY - this.state.y) * follow;
      this.state.rotate += (targetRotate - this.state.rotate) * follow;

      const active = s.scope === 'window' || this.state.hovered;
      let wanted = active ? clamp(speed / (2400 - 2100 * s.sensitivity), 0, 1) ** 2 : 0;
      if (this.state.hovered) wanted = Math.max(wanted, s.hoverDecay);

      const tau = wanted > this.state.level ? 0.08 : s.recovery;
      this.state.level += (wanted - this.state.level) * (1 - Math.exp(-dt / tau));

      this.rootEl.style.transform = `translate3d(${this.state.x.toFixed(2)}px, ${this.state.y.toFixed(2)}px, 0) rotate(${this.state.rotate.toFixed(3)}deg)`;

      const settling =
        Math.abs(targetX - this.state.x) + Math.abs(targetY - this.state.y) + Math.abs(targetRotate - this.state.rotate) > 0.05 ||
        Math.abs(wanted - this.state.level) > 0.002 ||
        speed > 1;

      const animating = s.idle > 0;
      this.tick = (this.tick + 1) % 2;
      if (settling || !animating || this.tick === 0) {
        this.draw();
      }

      this.calm = settling ? 0 : this.calm + dt;
      if (this.state.visible && (this.calm < 0.25 || animating)) {
        this.raf = requestAnimationFrame((n) => this.frame(n));
      }
    }

    /**
     * Update card image dynamically (e.g. after photo upload)
     */
    setImage(imageUrl) {
      if (!imageUrl) return;
      this.options.image = imageUrl;
      this.loadImage(imageUrl);
    }

    /**
     * Update card details dynamically (name, program, level, social links)
     */
    updateProfile(profile = {}) {
      if (profile.name) {
        this.options.name = profile.name;
        const nameEl = this.container.querySelector('#decayCardName');
        if (nameEl) nameEl.textContent = profile.name;
      }
      if (profile.program) {
        this.options.program = profile.program;
        const programEl = this.container.querySelector('#decayCardProgramText');
        if (programEl) programEl.textContent = profile.program;
      }
      if (profile.academicLevel) {
        this.options.academicLevel = profile.academicLevel;
        const levelEl = this.container.querySelector('#decayCardLevelText');
        if (levelEl) levelEl.textContent = profile.academicLevel;
      }

      // Update GitHub link
      const githubBtn = this.container.querySelector('#decayCardGithubBtn');
      if (githubBtn) {
        if (profile.github) {
          githubBtn.href = profile.github;
          githubBtn.classList.remove('disabled');
          githubBtn.title = 'View GitHub Profile';
        } else {
          githubBtn.href = '#';
          githubBtn.classList.add('disabled');
          githubBtn.title = 'No GitHub link provided';
        }
      }

      if (profile.email) {
        this.options.email = profile.email;
        const emailEl = this.container.querySelector('#decayCardEmail');
        if (emailEl) emailEl.textContent = profile.email;
      }

      // Update LinkedIn link
      const linkedinBtn = this.container.querySelector('#decayCardLinkedinBtn');
      if (linkedinBtn) {
        if (profile.linkedin) {
          linkedinBtn.href = profile.linkedin;
          linkedinBtn.classList.remove('disabled');
          linkedinBtn.title = 'View LinkedIn Profile';
        } else {
          linkedinBtn.href = '#';
          linkedinBtn.classList.add('disabled');
          linkedinBtn.title = 'No LinkedIn link provided';
        }
      }

      // Update LeetCode link
      const leetcodeBtn = this.container.querySelector('#decayCardLeetcodeBtn');
      if (leetcodeBtn) {
        if (profile.leetcode) {
          leetcodeBtn.href = profile.leetcode;
          leetcodeBtn.classList.remove('disabled');
          leetcodeBtn.title = 'View LeetCode Profile';
        } else {
          leetcodeBtn.href = '#';
          leetcodeBtn.classList.add('disabled');
          leetcodeBtn.title = 'No LeetCode link provided';
        }
      }

      // Update image if changed
      if (profile.profileImage && profile.profileImage !== this.options.image) {
        this.setImage(profile.profileImage);
      }
    }

    escapeHtml(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    destroy() {
      this.alive = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      window.removeEventListener('mousemove', this.onMouseMoveWindow);
      window.removeEventListener('resize', this.resize);
    }
  }

  window.DecayCard = DecayCard;

})(window);
