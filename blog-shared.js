/* Shared cinematic blog JS */
(function(){
  // Cursor
  const cur=document.getElementById('cur'),curR=document.getElementById('cur-r');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';},{passive:true});
  (function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(loop)})();
  document.querySelectorAll('a,button,.bftag').forEach(el=>{
    el.addEventListener('mouseenter',()=>{curR.style.width='56px';curR.style.height='56px';curR.style.borderColor='rgba(0,212,255,.6)'});
    el.addEventListener('mouseleave',()=>{curR.style.width='36px';curR.style.height='36px';curR.style.borderColor='rgba(0,212,255,.3)'});
  });

  // WebGL background
  const canvas=document.getElementById('bg-canvas');
  if(!canvas)return;
  const gl=canvas.getContext('webgl');
  if(!gl)return;
  canvas.width=innerWidth;canvas.height=innerHeight;
  window.addEventListener('resize',()=>{canvas.width=innerWidth;canvas.height=innerHeight;gl.viewport(0,0,canvas.width,canvas.height)},{passive:true});

  const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs=`
    precision mediump float;
    uniform float t;uniform vec2 r;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.1+vec2(1.7,9.2);a*=.5;}return v;}
    void main(){
      vec2 uv=gl_FragCoord.xy/r;
      float tm=t*.18;
      vec2 q=vec2(fbm(uv+tm*.4),fbm(uv+vec2(1.,7.)+tm*.35));
      vec2 rr=vec2(fbm(uv+2.*q+vec2(1.7,9.2)+tm*.2),fbm(uv+2.*q+vec2(8.3,2.8)+tm*.18));
      float f=fbm(uv+2.5*rr+tm*.1);
      vec3 c1=vec3(0.0,0.15,0.35);
      vec3 c2=vec3(0.0,0.55,0.80);
      vec3 c3=vec3(0.25,0.04,0.55);
      vec3 c4=vec3(0.7, 0.25,0.0);
      vec3 col=mix(c1,c3,clamp(f*2.2-.4,0.,1.));
      col=mix(col,c2,clamp(f*3.2-1.2,0.,1.));
      float ab=fbm(uv*2.+vec2(3.,0.)+tm*.08);
      col+=c4*ab*ab*1.4*smoothstep(.3,.9,uv.x)*smoothstep(.2,.8,uv.y);
      col=pow(max(col,vec3(0.)),vec3(.8))*1.6;
      float v=length((uv-.5)*1.4);
      col*=1.-v*.45;
      gl_FragColor=vec4(col,0.85);
    }
  `;
  function mk(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  const prog=gl.createProgram();
  gl.attachShader(prog,mk(gl.VERTEX_SHADER,vs));
  gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(prog);gl.useProgram(prog);
  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');
  gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  const uT=gl.getUniformLocation(prog,'t'),uR=gl.getUniformLocation(prog,'r');
  let aid;
  function loop(){aid=requestAnimationFrame(loop);gl.uniform1f(uT,performance.now()*.001);gl.uniform2f(uR,canvas.width,canvas.height);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
  loop();
  document.addEventListener('visibilitychange',()=>{document.hidden?cancelAnimationFrame(aid):loop()});
})();
