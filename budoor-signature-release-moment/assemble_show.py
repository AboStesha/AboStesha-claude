import re,sys
src=open('/home/user/AboStesha-claude/budoor-signature-release-moment/index_ar.html',encoding='utf-8').read()
head=src.split('</style>')[0]
head=head.replace('<title>بدور سيجنتشر — لحظة الإطلاق</title>','<title>بدور سيجنتشر — بذرة التوقيع</title>')
extra='''
  /* show deck */
  .sb{display:grid;grid-template-columns:1000px 1fr;grid-template-rows:562px 1fr;gap:18px 48px;height:720px}
  .sb .img{grid-row:1;grid-column:1;width:1000px;height:562px}
  .sb .say{grid-row:2;grid-column:1;border-inline-start:3px solid var(--gold);padding-inline-start:20px;align-self:start}
  .sb .say h4{font-size:13px;color:var(--gold);font-weight:700;margin-bottom:5px}
  .sb .say p{font-size:15.5px;line-height:1.55;color:var(--ink)}
  .sb .say p i{color:var(--mute);font-style:normal;font-size:14px}
  .sb .txt{grid-row:1/3;grid-column:2;display:flex;flex-direction:column;gap:14px;height:720px}
  .sb .tcbig{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:40px;color:var(--gold);direction:ltr;unicode-bidi:isolate;text-align:right;line-height:1}
  .sb h3{font-size:30px;font-weight:700;line-height:1.3;margin-bottom:4px}
  .sb .blk h4{font-size:14px;color:var(--gold);font-weight:700;margin-bottom:4px}
  .sb .blk p{font-size:16.5px;line-height:1.6;color:var(--ink2)}
  .sb .cue{margin-top:auto;padding-top:12px;border-top:1px solid var(--line);font-size:14px;line-height:1.6;color:var(--ink)}
  .sb .cue b{color:var(--gold);margin-inline-end:8px}
  .plan{display:flex;flex-direction:column;gap:18px;height:100%}
  .plan .wall{height:110px;border:2px solid var(--gold);border-radius:600px/60px;display:flex;align-items:center;justify-content:center;background:#141414;color:var(--gold2);font-size:15px}
  .plan .floor{flex:1;display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:20px;background:#e9e9e6;border-radius:8px;padding:28px;align-items:center}
  .plan .spot{background:#fff;border:1px solid var(--line);border-radius:8px;padding:20px;display:flex;flex-direction:column;gap:6px}
  .plan .spot.mag{border:2px solid var(--gold);align-self:end}
  .plan .spot i{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:40px;color:var(--gold);line-height:1}
  .plan .spot b{font-size:20px}
  .plan .spot span{font-size:14px;color:var(--mute)}
  .plan .spot em{font-style:normal;font-size:13px;line-height:1.5;color:var(--ink2);margin-top:8px;border-top:1px solid var(--line);padding-top:8px}
  .plan .aud{border:1px dashed #bbb;border-radius:8px;padding:14px;text-align:center;font-size:15px;color:var(--ink2)}
  .plan .cam{text-align:center;font-size:13px;color:var(--mute)}
  .states{top:200px;bottom:120px;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:auto auto;gap:24px 24px;align-content:start}
  .st{grid-column:span 2}
  .st.wide{grid-column:span 3}
  .st .img{aspect-ratio:21/9;width:100%}
  .st .t{margin-top:10px;font-size:13.5px;line-height:1.5;color:var(--ink2)}
  .st .t b{display:block;color:var(--gold);font-size:13px;margin-bottom:3px;direction:ltr;text-align:right}
  .script{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-content:start}
  .script .col{display:flex;flex-direction:column}
  .script .ln{display:grid;grid-template-columns:64px 1fr;gap:18px;padding:12px 0;border-bottom:1px solid var(--line)}
  .script .ln.last{border-bottom:0}
  .script .ln b{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:26px;color:var(--gold);direction:ltr;line-height:1.2}
  .script .ln p{font-size:15.5px;line-height:1.6;color:var(--ink)}
  .script .ln p i{color:var(--mute);font-style:normal;font-size:14px}
  .script.en .ln p{font-family:'Inter',sans-serif;font-size:15.5px;line-height:1.5}
  .script.en .ln p i{font-style:italic}
  .cues th{font-size:13px;padding-bottom:12px}
  .cues td{font-size:15px;padding:11px 0;padding-inline-end:14px;line-height:1.45}
  .cues td:first-child{font-size:17px;width:70px;direction:ltr;text-align:right;font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold);font-weight:500}
</style>
</head>
<body>
'''
body=open('show_body.html',encoding='utf-8').read()
out=head+extra+body+'\n</body>\n</html>\n'
open('/home/user/AboStesha-claude/budoor-signature-release-moment/index_show_ar.html','w',encoding='utf-8').write(out)
print('ok',len(out))
