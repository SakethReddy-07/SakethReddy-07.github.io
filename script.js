/* ============================================================
   SAKETH REDDY | PORTFOLIO — FULL ANIMATION SCRIPT
   optimised plexus + mouse reactive + waves + glitch +
   3D tilt + shield gyroscope + parallax + reveals + trail
   ============================================================ */

const PI2 = Math.PI * 2;
function rand(a, b) { return a + Math.random() * (b - a); }
function lerp(a, b, t) { return a + (b - a) * t; }

(function initPlexus() {
  const canvas = document.getElementById("plexus-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  let W, H, nodes = [], animId;
  let mouseX = -999, mouseY = -999;
  const COUNT=70, DIST=140, DIST_SQ=140*140, SPEED=2.8, MOUSE_RADIUS=180, MOUSE_FORCE=3.5, INTERVAL=1000/60;
  let last=0;
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  function build(){ nodes=Array.from({length:COUNT},()=>({x:rand(0,W),y:rand(0,H),vx:rand(-SPEED,SPEED),vy:rand(-SPEED,SPEED),r:Math.random()>0.82?rand(6,10):rand(2.5,5)})); }
  window.addEventListener("mousemove",e=>{mouseX=e.clientX;mouseY=e.clientY;},{passive:true});
  window.addEventListener("mouseleave",()=>{mouseX=-999;mouseY=-999;});
  const ZONES=6;
  const ZONE_COLORS=Array.from({length:ZONES},(_,i)=>{const t=i/(ZONES-1);return "rgba("+Math.round(lerp(255,0,t))+","+Math.round(lerp(140,212,t))+","+Math.round(lerp(66,255,t))+",";});
  function draw(ts){
    animId=requestAnimationFrame(draw);
    if(ts-last<INTERVAL) return;
    last=ts;
    ctx.clearRect(0,0,W,H);
    for(let z=0;z<ZONES;z++){
      const xMin=(z/ZONES)*W,xMax=((z+1)/ZONES)*W;
      ctx.strokeStyle=ZONE_COLORS[z]+"0.18)";ctx.lineWidth=0.5;ctx.beginPath();
      for(let i=0;i<nodes.length;i++){const a=nodes[i];if(a.x<xMin||a.x>xMax)continue;for(let j=i+1;j<nodes.length;j++){const b=nodes[j];const dx=a.x-b.x,dy=a.y-b.y;if(dx*dx+dy*dy<DIST_SQ){ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}}}
      ctx.stroke();
    }
    if(mouseX>0){ctx.lineWidth=0.7;nodes.forEach(n=>{const dx=n.x-mouseX,dy=n.y-mouseY;const dSq=dx*dx+dy*dy;if(dSq<MOUSE_RADIUS*MOUSE_RADIUS){const alpha=(1-Math.sqrt(dSq)/MOUSE_RADIUS)*0.55;ctx.strokeStyle="rgba(0,212,255,"+alpha+")";ctx.beginPath();ctx.moveTo(mouseX,mouseY);ctx.lineTo(n.x,n.y);ctx.stroke();}});}
    nodes.forEach(n=>{const t=n.x/W;const col="rgb("+Math.round(lerp(255,0,t))+","+Math.round(lerp(140,212,t))+","+Math.round(lerp(66,255,t))+")";ctx.shadowColor=col;ctx.shadowBlur=n.r*10;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,PI2);ctx.fill();});
    ctx.shadowBlur=0;
    nodes.forEach(n=>{const mdx=n.x-mouseX,mdy=n.y-mouseY;const mDist=Math.sqrt(mdx*mdx+mdy*mdy);if(mDist<MOUSE_RADIUS&&mDist>0){const force=(MOUSE_RADIUS-mDist)/MOUSE_RADIUS*MOUSE_FORCE;n.vx+=(mdx/mDist)*force*0.08;n.vy+=(mdy/mDist)*force*0.08;}const spd=Math.sqrt(n.vx*n.vx+n.vy*n.vy);if(spd>SPEED*2){n.vx=(n.vx/spd)*SPEED*2;n.vy=(n.vy/spd)*SPEED*2;}n.x+=n.vx;n.y+=n.vy;if(n.x<0)n.x=W;else if(n.x>W)n.x=0;if(n.y<0)n.y=H;else if(n.y>H)n.y=0;});
  }
  resize();build();
  window.addEventListener("resize",()=>{resize();build();});
  animId=requestAnimationFrame(draw);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(animId);else animId=requestAnimationFrame(draw);});
})();

(function initWaves(){
  const canvas=document.getElementById("wave-canvas");if(!canvas)return;
  const ctx=canvas.getContext("2d",{alpha:true});let W,H,t=0,animId,last=0;const INTERVAL=1000/24;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  const WAVES=[{amp:80,freq:.007,speed:.09,yBase:.35,r:0,g:212,b:255,a:.07,w:1.4},{amp:65,freq:.010,speed:.13,yBase:.45,r:124,g:111,b:247,a:.08,w:1.1},{amp:90,freq:.006,speed:.08,yBase:.53,r:255,g:140,b:66,a:.06,w:1.6},{amp:55,freq:.012,speed:.15,yBase:.61,r:0,g:200,b:180,a:.07,w:.9},{amp:70,freq:.009,speed:.11,yBase:.40,r:180,g:100,b:255,a:.06,w:1.2}];
  function draw(ts){animId=requestAnimationFrame(draw);if(ts-last<INTERVAL)return;last=ts;t+=2;ctx.clearRect(0,0,W,H);WAVES.forEach((wv,wi)=>{const yb=H*wv.yBase;ctx.beginPath();for(let x=0;x<=W;x+=6){const y=yb+Math.sin(x*wv.freq+t*wv.speed+wi)*wv.amp;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle="rgba("+wv.r+","+wv.g+","+wv.b+","+wv.a+")";ctx.lineWidth=wv.w;ctx.shadowColor="rgba("+wv.r+","+wv.g+","+wv.b+",.25)";ctx.shadowBlur=6;ctx.stroke();});ctx.shadowBlur=0;}
  resize();window.addEventListener("resize",resize);animId=requestAnimationFrame(draw);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(animId);else animId=requestAnimationFrame(draw);});
})();

(function initGlitch(){
  const el=document.querySelector(".hero-name");if(!el)return;
  function glitch(){el.classList.add("glitching");setTimeout(()=>el.classList.remove("glitching"),420);setTimeout(glitch,rand(2500,6000));}
  setTimeout(glitch,2000);
})();

(function initNav(){
  const nav=document.getElementById("navbar");
  const links=document.querySelectorAll(".nav-links a");
  const ham=document.getElementById("hamburger");
  const menu=document.getElementById("nav-links");
  window.addEventListener("scroll",()=>{nav.classList.toggle("scrolled",window.scrollY>50);let cur="";document.querySelectorAll("section[id]").forEach(s=>{if(window.scrollY>=s.offsetTop-130)cur=s.id;});links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+cur));},{passive:true});
  if(ham){ham.addEventListener("click",()=>menu.classList.toggle("open"));menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("open")));}
})();

(function initTyped(){
  const el=document.getElementById("typed-text");if(!el)return;
  const phrases=["Penetration Tester","Security Analyst","Ethical Hacker","CTF Player","Bug Hunter","Red Teamer","VAPT Specialist"];
  let pi=0,ci=0,del=false,pause=false;
  function type(){if(pause){pause=false;setTimeout(type,1400);return;}const ph=phrases[pi];if(!del){el.textContent=ph.slice(0,++ci);if(ci===ph.length){del=true;pause=true;}}else{el.textContent=ph.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;}}setTimeout(type,del?40:80);}
  type();
})();

function runCounter(el){if(el.dataset.done)return;el.dataset.done="1";const target=parseInt(el.dataset.target,10);let cur=0;const step=Math.max(1,Math.ceil(target/40));const timer=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=cur;if(cur>=target)clearInterval(timer);},35);}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".hcnt").forEach(runCounter);
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll(".acnt").forEach(runCounter);obs.unobserve(e.target);}});},{threshold:.3});
  const a=document.getElementById("about");if(a)obs.observe(a);
});

(function(){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w+"%";obs.unobserve(e.target);}});},{threshold:.3});document.querySelectorAll(".skf").forEach(b=>obs.observe(b));})();

(function initReveal(){
  const dirMap=[{sel:".proj-card,.cert-card,.blog-card",dir:"up"},{sel:".skill-row,.exp-card",dir:"left"},{sel:".tool-tile,.astat",dir:"scale"},{sel:".bio-card,.form-card",dir:"right"},{sel:".tech-wrap,.clink",dir:"up"},{sel:".glass-card",dir:"up"}];
  dirMap.forEach(({sel,dir})=>document.querySelectorAll(sel).forEach(el=>el.classList.add("reveal","reveal-"+dir)));
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);}});},{threshold:.08});
  document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
})();

(function(){[".proj-grid",".blog-grid",".tools-grid",".skill-list",".cert-grid",".exp-list"].forEach(sel=>{const c=document.querySelector(sel);if(!c)return;const kids=Array.from(c.children);const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){kids.forEach((k,i)=>setTimeout(()=>k.classList.add("visible"),i*120));obs.unobserve(e.target);}});},{threshold:.08});obs.observe(c);});})();

(function initSectionDepth(){
  const heads=document.querySelectorAll(".sec-head h2");
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.animation="headDrop 0.8s cubic-bezier(0.23,1,0.32,1) forwards";obs.unobserve(e.target);}});},{threshold:.5});
  heads.forEach(h=>{h.style.opacity="0";h.style.transform="perspective(400px) rotateX(-28deg) translateY(24px)";obs.observe(h);});
})();

(function init3DTilt(){
  const SEL=".proj-card,.cert-card,.blog-card,.exp-right,.tool-tile,.glass-card,.astat";const MAX=13;
  function attach(card){let bounds;
    card.addEventListener("mouseenter",()=>{bounds=card.getBoundingClientRect();card.style.transition="transform 0.08s ease,box-shadow 0.08s ease";});
    card.addEventListener("mousemove",e=>{if(!bounds)bounds=card.getBoundingClientRect();const x=e.clientX-bounds.left,y=e.clientY-bounds.top;const cx=bounds.width/2,cy=bounds.height/2;const rotY=((x-cx)/cx)*MAX;const rotX=-((y-cy)/cy)*MAX;card.style.transform="perspective(600px) rotateX("+rotX+"deg) rotateY("+rotY+"deg) scale3d(1.05,1.05,1.05)";card.style.background="radial-gradient(circle at "+((x/bounds.width)*100).toFixed(1)+"% "+((y/bounds.height)*100).toFixed(1)+"%, rgba(0,212,255,0.09) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.02) 100%)";});
    card.addEventListener("mouseleave",()=>{card.style.transition="transform 0.6s cubic-bezier(0.23,1,0.32,1),box-shadow 0.6s ease,background 0.6s ease";card.style.transform="perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";card.style.background="";});
    card.addEventListener("mousedown",()=>{card.style.transform="perspective(600px) scale3d(0.97,0.97,0.97)";});
    card.addEventListener("mouseup",()=>{card.style.transform="perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";});
  }
  function attachAll(){document.querySelectorAll(SEL).forEach(attach);}
  attachAll();setTimeout(attachAll,1800);
})();

(function initShield3D(){
  const wrap=document.querySelector(".shield-wrap");const home=document.getElementById("home");if(!wrap||!home)return;
  home.addEventListener("mousemove",e=>{const r=home.getBoundingClientRect();const rx=-((e.clientY-r.top-r.height/2)/(r.height/2))*18;const ry=((e.clientX-r.left-r.width/2)/(r.width/2))*18;wrap.style.transform="perspective(900px) rotateX("+rx+"deg) rotateY("+ry+"deg)";wrap.style.transition="transform 0.08s ease";});
  home.addEventListener("mouseleave",()=>{wrap.style.transform="perspective(900px) rotateX(0deg) rotateY(0deg)";wrap.style.transition="transform 0.9s cubic-bezier(0.23,1,0.32,1)";});
})();

(function initParallax(){
  const layers=[{sel:".orb-1",speed:.08},{sel:".orb-2",speed:.05},{sel:".orb-3",speed:-.06},{sel:".orb-4",speed:.10}];
  const els=layers.map(l=>({el:document.querySelector(l.sel),speed:l.speed})).filter(l=>l.el);
  let ticking=false;
  window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(()=>{const sy=window.scrollY;els.forEach(({el,speed})=>{el.style.transform="translateY("+sy*speed+"px)";});ticking=false;});ticking=true;}},{passive:true});
})();

(function initCursor(){
  let count=0;
  document.addEventListener("mousemove",e=>{if(count>10)return;count++;const cyan=Math.random()>.5;const d=document.createElement("div");Object.assign(d.style,{position:"fixed",left:e.clientX+"px",top:e.clientY+"px",width:"5px",height:"5px",borderRadius:"50%",background:cyan?"rgba(0,212,255,0.8)":"rgba(255,140,66,0.8)",boxShadow:cyan?"0 0 8px rgba(0,212,255,.9)":"0 0 8px rgba(255,140,66,.9)",pointerEvents:"none",zIndex:"9999",transform:"translate(-50%,-50%)",transition:"opacity .25s ease,transform .25s ease"});document.body.appendChild(d);requestAnimationFrame(()=>{d.style.opacity="0";d.style.transform="translate(-50%,-50%) scale(3)";});setTimeout(()=>{d.remove();count--;},260);},{passive:true});
  document.addEventListener("click",e=>{const r=document.createElement("div");Object.assign(r.style,{position:"fixed",left:e.clientX+"px",top:e.clientY+"px",width:"8px",height:"8px",borderRadius:"50%",border:"2px solid rgba(0,212,255,.9)",pointerEvents:"none",zIndex:"9998",transform:"translate(-50%,-50%) scale(1)",transition:"transform .55s ease,opacity .55s ease",opacity:"1"});document.body.appendChild(r);requestAnimationFrame(()=>{r.style.transform="translate(-50%,-50%) scale(12)";r.style.opacity="0";});setTimeout(()=>r.remove(),580);});
})();

document.querySelectorAll("a[href^='#']").forEach(a=>{a.addEventListener("click",function(e){const t=document.querySelector(this.getAttribute("href"));if(!t)return;e.preventDefault();window.scrollTo({top:t.offsetTop-68,behavior:"smooth"});});});

function handleSubmit(e){e.preventDefault();const btn=e.target.querySelector("button[type='submit']");const res=document.getElementById("form-res");const orig=btn.textContent;btn.textContent="Sending...";btn.disabled=true;setTimeout(()=>{btn.textContent="Message Sent!";res.textContent="✓ Transmitted successfully.";e.target.reset();setTimeout(()=>{btn.textContent=orig;btn.disabled=false;res.textContent="";},4000);},1500);}

document.addEventListener("DOMContentLoaded",()=>{document.body.style.opacity="0";document.body.style.transition="opacity 0.6s ease";requestAnimationFrame(()=>{document.body.style.opacity="1";});});
