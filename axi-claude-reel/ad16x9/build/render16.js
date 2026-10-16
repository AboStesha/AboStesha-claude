const { chromium } = require('/opt/node-tools/node_modules/playwright');
const { spawn } = require('child_process');
(async()=>{
  const [,,mode,arg,out]=process.argv;
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1920,height:1080}});
  await p.goto('file://'+__dirname+'/over.html'+(process.argv[5]?('?'+process.argv[5]):'')); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(600);
  if(mode==='preview'){
    for(const t of arg.split(',')){ await p.evaluate(t=>render(t),Number(t)); await p.screenshot({path:`${out}/o_${t}.png`,omitBackground:true}); }
  } else {
    const [fps,dur]=arg.split(':').map(Number); const N=Math.round(fps*dur);
    const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','png','-i','-','-c:v','ffv1','-pix_fmt','bgra',`${out}/over.mkv`],{stdio:['pipe','inherit','inherit']});
    for(let i=0;i<N;i++){ await p.evaluate(t=>render(t),i/fps); const buf=await p.screenshot({omitBackground:true,type:'png'});
      if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r)); if(i%100==0) console.log(i); }
    ff.stdin.end(); await new Promise(r=>ff.on('close',r));
  }
  await b.close();
})();
