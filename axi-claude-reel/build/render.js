const { chromium } = require('/opt/node-tools/node_modules/playwright');
const { spawn } = require('child_process');
(async()=>{
  const [,,mode,arg,out]=process.argv;
  const b=await chromium.launch().catch(()=>chromium.launch({executablePath:'/opt/pw-browsers/chromium'}));
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+__dirname+'/overlay.html'); await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(500);
  if(mode==='preview'){
    for(const t of arg.split(',').map(Number)){ for(const L of ['under','top']){
      await p.evaluate(([t,L])=>render(t,L),[t,L]);
      await p.screenshot({path:`${out}/p_${t}_${L}.png`,omitBackground:true}); } }
  } else {
    const [fps,dur]=arg.split(':').map(Number); const N=Math.round(fps*dur);
    for(const L of ['under','top']){
      const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','png','-i','-','-c:v','ffv1','-pix_fmt','bgra',`${out}/${L}.mkv`],{stdio:['pipe','inherit','inherit']});
      for(let i=0;i<N;i++){ await p.evaluate(([t,L])=>render(t,L),[i/fps,L]);
        const buf=await p.screenshot({omitBackground:true,type:'png'});
        if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
        if(i%100==0) console.log(L,i); }
      ff.stdin.end(); await new Promise(r=>ff.on('close',r)); }
  }
  await b.close();
})();
