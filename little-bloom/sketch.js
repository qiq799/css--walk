const W=1500,H=1000;let flowers=[],butterflies=[],vines=[],cells=[],grow=false,selected=1,last=0;const colors=['#eaa3b6','#9ebfda','#f2cf75'];function setup(){let c=createCanvas(W,H);c.parent('garden');pixelDensity(1)}function draw(){clear();if(grow&&frameCount%2===0){for(let i=0;i<8&&cells.length;i++){let p=cells.pop(),a=random(TWO_PI);vines.push({x:p.x,y:p.y,a,s:random(1,2)});}if(!cells.length)grow=false}for(let v of vines){push();translate(v.x,v.y);rotate(v.a);stroke('#546d45');strokeWeight(3);line(-22,0,22,0);fill('#9ab47c');stroke('#536a41');ellipse(-10,-13,15*v.s,27*v.s);ellipse(10,13,15*v.s,27*v.s);pop()}for(let f of flowers){let age=frameCount-f.b;push();translate(f.x,f.y);rotate(age*.005);scale(f.s);let open=min(1,age/80);for(let i=0;i<7;i++){push();rotate(TWO_PI*i/7);translate(0,-19*open);fill(colors[f.t-1]);stroke('#805448');strokeWeight(1.2);ellipse(0,-17*open,28,42*open);pop()}fill('#f3d579');stroke('#79513a');circle(0,0,23);pop()}for(let b of butterflies){b.x+=b.v;b.y+=sin(frameCount*.05+b.p)*.7;if(b.x>W+80)b.x=-80;push();translate(b.x,b.y);scale(2.4);let flap=.75+.25*sin(frameCount*.22+b.p);stroke('#654936');strokeWeight(1.5);fill('#e8a6ad');ellipse(-13*flap,-8,26*flap,32);ellipse(13*flap,-8,26*flap,32);fill('#eecb80');ellipse(-11*flap,12,20*flap,24);ellipse(11*flap,12,20*flap,24);stroke('#493a30');strokeWeight(3);line(0,-14,0,20);pop()}}function trigger(k){console.log('Key triggered:',k);if('123'.includes(k)){selected=Number(k);flowers.push({x:random(130,W-130),y:random(340,H-110),t:selected,s:random(1.7,2.3),b:frameCount})}else if(k==='4'){for(let i=0;i<3;i++)butterflies.push({x:random(W),y:random(260,H-130),v:random(.5,2),p:random(TWO_PI)})}else if(k==='5'){flowers=[];butterflies=[];vines=[];cells=[];grow=false}else if(k==='6'){playVineSound();vines=[];cells=[];for(let y=20;y<H;y+=35)for(let x=20;x<W;x+=35)cells.push({x:x+random(-10,10),y:y+random(-10,10),d:min(x,W-x,y,H-y)+random(0,80)});cells.sort((a,b)=>b.d-a.d);grow=true}}function keyPressed(){if('123456'.includes(key))trigger(key)}function mousePressed(){if(mouseY>250){console.log('Mouse planted:',selected);flowers.push({x:mouseX,y:mouseY,t:selected,s:random(1.5,2),b:frameCount})}}function mouseDragged(){if(frameCount-last>8&&mouseY>250){last=frameCount;mousePressed()}}
// Four seconds of clearly audible, textured grass rustling on key 6.
let bloomAudio;
function playVineSound(){
 try{
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  if(!bloomAudio)bloomAudio=new AC();
  const ctx=bloomAudio;
  const play=()=>{
   const dur=4,now=ctx.currentTime,n=Math.floor(ctx.sampleRate*dur);
   const buf=ctx.createBuffer(1,n,ctx.sampleRate),data=buf.getChannelData(0);
   let low=0;
   for(let i=0;i<n;i++){
    const t=i/ctx.sampleRate;
    const white=Math.random()*2-1;
    low=low*.93+white*.07;
    const pulse=.62+.18*Math.sin(t*17)+.13*Math.sin(t*37)+.07*Math.sin(t*8);
    data[i]=(white*.7+low*.6)*pulse;
   }
   const source=ctx.createBufferSource();source.buffer=buf;
   const filter=ctx.createBiquadFilter();filter.type='highpass';filter.frequency.value=320;
   const gain=ctx.createGain();
   gain.gain.setValueAtTime(0,now);
   gain.gain.linearRampToValueAtTime(.55,now+.12);
   gain.gain.setValueAtTime(.55,now+3.5);
   gain.gain.linearRampToValueAtTime(0,now+4);
   source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);
   source.start(now);source.stop(now+dur);
  };
  if(ctx.state==='suspended')ctx.resume().then(play).catch(console.warn);else play();
 }catch(e){console.warn('Rustling sound unavailable:',e)}
}
