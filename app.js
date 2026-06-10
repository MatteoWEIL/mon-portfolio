/* =====================================================================
   PORTFOLIO MATTÉO WEIL — ANIMATIONS & INTERACTIONS
   (mode sombre/clair, vagues pixel, nom réactif souris, 3D, lightbox)
   ===================================================================== */
function toggleTheme(){var el=document.documentElement,l=el.getAttribute('data-theme')==='light';
  if(l){el.removeAttribute('data-theme');try{localStorage.setItem('mw-theme','dark');}catch(e){}}
  else{el.setAttribute('data-theme','light');try{localStorage.setItem('mw-theme','light');}catch(e){}}
  syncThemeIcon();}
function syncThemeIcon(){var l=document.documentElement.getAttribute('data-theme')==='light',b=document.getElementById('theme-btn');if(!b)return;
  b.innerHTML=l?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
  :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';}

function mwGrad(t){var r,g,b,k;
  if(t<0.5){k=t/0.5;r=139+(192-139)*k;g=92+(38-92)*k;b=246+(211-246)*k;}
  else{k=(t-0.5)/0.5;r=192+(255-192)*k;g=38+(59-38)*k;b=211+(107-211)*k;}
  return 'rgb('+(r|0)+','+(g|0)+','+(b|0)+')';}

var REDUCE=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('DOMContentLoaded',function(){
  syncThemeIcon();
  var header=document.getElementById('header');
  var sp=document.querySelector('.scroll-progress'),tt=document.querySelector('.to-top');
  window.addEventListener('scroll',function(){
    if(header)header.classList.toggle('scrolled',scrollY>30);
    var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    if(sp)sp.style.width=(max>0?scrollY/max*100:0)+'%';
    if(tt)tt.classList.toggle('show',scrollY>500);});
  if(tt)tt.addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'});});
  var burger=document.getElementById('burger'),links=document.getElementById('navlinks');
  if(burger)burger.addEventListener('click',function(){links.classList.toggle('open');});

  /* apparition au défilement (avec repli si navigateur ancien) */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
    var cO=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
      var el=e.target,end=+el.dataset.count,cur=0,st=Math.max(1,Math.round(end/40));
      var t=setInterval(function(){cur+=st;if(cur>=end){cur=end;clearInterval(t);}el.textContent=cur;},22);cO.unobserve(el);});},{threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(c){cO.observe(c);});
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
    document.querySelectorAll('[data-count]').forEach(function(c){c.textContent=c.dataset.count;});
  }

  if(!REDUCE){var glow=document.querySelector('.cursor-glow');
    window.addEventListener('mousemove',function(e){if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';}});
    document.querySelectorAll('.btn').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();
        b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.3-3)+'px)';});
      b.addEventListener('mouseleave',function(){b.style.transform='';});});}

  /* transition en fondu entre les pages */
  var fade=document.querySelector('.page-fade');
  document.querySelectorAll('a[href$=".html"]').forEach(function(a){
    a.addEventListener('click',function(ev){var u=a.getAttribute('href');
      if(u&&u.indexOf('http')!==0&&!REDUCE){ev.preventDefault();fade.classList.add('show');setTimeout(function(){location.href=u;},360);}});});

  /* lightbox : toute image avec la classe "zoom" s'ouvre en grand */
  var lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<img alt="">';document.body.appendChild(lb);
  lb.addEventListener('click',function(){lb.classList.remove('show');});
  document.addEventListener('click',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('zoom')){
    lb.querySelector('img').src=e.target.src;lb.classList.add('show');}});

  initPixelWaves();initPixelName();init3D();
});

/* vagues pixel animées en continu */
function initPixelWaves(){
  document.querySelectorAll('canvas.pixel-wave').forEach(function(cv){
    var ctx=cv.getContext('2d'),t=Math.random()*10,cell=12;
    function size(){cv.width=cv.clientWidth;cv.height=cv.clientHeight;}
    size();
    function draw(){var w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
      for(var x=0;x<w;x+=cell){
        var base=h*0.42+Math.sin(x*0.013+t)*h*0.26+Math.sin(x*0.005-t*0.6)*h*0.12;
        var col=mwGrad(x/w);
        for(var y=base;y<h;y+=cell){ctx.globalAlpha=(y<base+cell*1.4)?1:0.9;ctx.fillStyle=col;ctx.fillRect(x,y,cell-2,cell-2);}}
      ctx.globalAlpha=1;t+=0.035;if(!REDUCE)requestAnimationFrame(draw);}
    draw();window.addEventListener('resize',function(){size();if(REDUCE)draw();});});}

/* nom en pixels réactif à la souris */
function initPixelName(){
  var cv=document.getElementById('pixelName');if(!cv)return;
  var ctx=cv.getContext('2d'),particles=[],mouse={x:-9999,y:-9999},sz=3;
  function build(){var W=cv.parentElement.clientWidth,H=cv.parentElement.clientHeight;
    cv.width=W;cv.height=H;ctx.clearRect(0,0,W,H);
    var fs=Math.min(W/4.2,160),lh=fs*0.9;
    ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='700 '+fs+"px 'Space Grotesk', sans-serif";
    ctx.fillText('MATTÉO',W/2,H/2-lh/2);ctx.fillText('WEIL',W/2,H/2+lh/2);
    var d=ctx.getImageData(0,0,W,H).data;ctx.clearRect(0,0,W,H);
    particles=[];sz=Math.max(2,Math.round(fs/40));var gap=Math.max(4,Math.round(fs/20));
    for(var y=0;y<H;y+=gap)for(var x=0;x<W;x+=gap){
      if(d[(y*W+x)*4+3]>128)particles.push({hx:x,hy:y,x:Math.random()*W,y:Math.random()*H,c:mwGrad(x/W)});}}
  function frame(){var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    for(var i=0;i<particles.length;i++){var p=particles[i];
      var dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy;
      if(d2<8000){var dd=Math.sqrt(d2)||1,f=(90-dd)/90*4.2;p.x+=dx/dd*f;p.y+=dy/dd*f;}
      p.x+=(p.hx-p.x)*0.12;p.y+=(p.hy-p.y)*0.12;ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,sz,sz);}
    requestAnimationFrame(frame);}
  function staticDraw(){ctx.clearRect(0,0,cv.width,cv.height);for(var i=0;i<particles.length;i++){var p=particles[i];ctx.fillStyle=p.c;ctx.fillRect(p.hx,p.hy,sz,sz);}}
  cv.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
  cv.addEventListener('mouseleave',function(){mouse.x=-9999;mouse.y=-9999;});
  cv.addEventListener('touchmove',function(e){var r=cv.getBoundingClientRect(),tt=e.touches[0];mouse.x=tt.clientX-r.left;mouse.y=tt.clientY-r.top;},{passive:true});
  function go(){build();if(REDUCE)staticDraw();else frame();}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);else setTimeout(go,300);
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){build();if(REDUCE)staticDraw();},250);});}

/* objet 3D (Three.js) */
function init3D(){if(REDUCE)return;
  var canvas=document.getElementById('three-canvas');if(!window.THREE||!canvas)return;
  var wrap=canvas.parentElement;
  var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,.1,100);cam.position.z=4.4;
  function size(){var w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(devicePixelRatio,2));cam.aspect=w/h;cam.updateProjectionMatrix();}
  var inner=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),new THREE.MeshBasicMaterial({color:0xC026D3,wireframe:true,transparent:true,opacity:.9}));
  var outer=new THREE.Mesh(new THREE.IcosahedronGeometry(1.95,1),new THREE.MeshBasicMaterial({color:0xFF3B6B,wireframe:true,transparent:true,opacity:.38}));
  var core=new THREE.Mesh(new THREE.IcosahedronGeometry(.85,2),new THREE.MeshBasicMaterial({color:0x8B5CF6,wireframe:true,transparent:true,opacity:.6}));
  scene.add(inner,outer,core);
  var pg=new THREE.BufferGeometry(),N=150,pos=new Float32Array(N*3);
  for(var i=0;i<N*3;i++)pos[i]=(Math.random()-.5)*9;
  pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xC026D3,size:.035,transparent:true,opacity:.6})));
  var mx=0,my=0;window.addEventListener('mousemove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
  (function loop(){inner.rotation.y+=.004;inner.rotation.x+=.002;outer.rotation.y-=.0028;outer.rotation.z+=.0016;
    core.rotation.y-=.006;core.rotation.x+=.004;scene.rotation.y+=(mx*.5-scene.rotation.y)*.05;scene.rotation.x+=(my*.5-scene.rotation.x)*.05;
    renderer.render(scene,cam);requestAnimationFrame(loop);})();
  size();window.addEventListener('resize',size);}
