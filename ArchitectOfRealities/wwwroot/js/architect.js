// wwwroot/js/architect.js
let gl, program, rafId, startTime, canvas, uTime, uRes;
let frame = 0;

const vert = `#version 300 es
precision highp float;
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const frag = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }

void main(){
    vec2 uv = (gl_FragCoord.xy / u_res) * 2.0 - 1.0;
    uv.x *= u_res.x / u_res.y;

    float t = u_time * 0.6;

    vec2 g = abs(fract(uv * 6.0 - t) - 0.5);
    float grid = smoothstep(0.03, 0.0, min(g.x, g.y));

    float r = length(uv);
    float rings = 0.6 * (0.5 + 0.5 * cos(24.0 * r - t * 4.0)) * smoothstep(1.2, 0.0, r);

    float stars = step(0.995, hash(gl_FragCoord.xy + floor(t*60.0))) * 0.9;

    vec3 base = mix(vec3(0.05, 0.08, 0.12), vec3(0.0, 0.6, 0.9), 0.5 + 0.5 * uv.y);
    vec3 fx = base + vec3(0.2, 0.05, 0.35) * grid + vec3(0.1, 0.25, 0.05) * rings + vec3(stars);

    float vig = smoothstep(1.3, 0.2, r);
    fx *= vig;

    o = vec4(fx, 1.0);
}
`;

function createShader(gl, type, src){
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        throw new Error("Shader compile failed");
    }
    return sh;
}

function createProgram(gl, vs, fs){
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if(!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(p));
        throw new Error("Program link failed");
    }
    return p;
}

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
    }
}

function loop(ts){
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;
    gl.uniform1f(uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(loop);
    if (++frame % 30 === 0) resize();
}

export const architect = {
    start: (selector) => {
        canvas = document.querySelector(selector);
        const opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" };
        gl = canvas.getContext("webgl2", opts);
        if (!gl) { alert("WebGL2 not available"); return; }

        const vs = createShader(gl, gl.VERTEX_SHADER, vert);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, frag);
        program = createProgram(gl, vs, fs);
        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,  3, -1,  -1, 3
        ]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        uTime = gl.getUniformLocation(program, "u_time");
        uRes  = gl.getUniformLocation(program, "u_res");

        canvas.style.width = "100%";
        canvas.style.height = "100%";

        resize();
        window.addEventListener("resize", resize);
        rafId = requestAnimationFrame(loop);
    },
    stop: () => {
        window.removeEventListener("resize", resize);
        if (rafId) cancelAnimationFrame(rafId);
    }
};
