import re,html,json,sys,glob
S=__import__("sys").argv[1]
def clean(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s))).strip()
out=[]
files={"school":{"2025":"TeacherCitation.html","2024":"TeacherCitation_2024.html","2023":"TeacherCitation_2023.html","2022":"TeacherCitation_2022.html","2021":"TeacherCitation_2021.html"},
       "higher":{"2025":"heawardeecitation.html","2024":"heawardeecitation_2024.html","2023":"heawardeecitation_2023.html"}}
for cat,fs in files.items():
  for y,f in fs.items():
    t=open(S+"/dl/"+f,encoding="utf-8",errors="ignore").read()
    m=re.search(r'id="ctl00_ContentPlaceHolder1_pan'+y+'"(.*)',t,re.S)
    body=m.group(1) if m else t
    cards=re.split(r'<div class="awardee-card',body)[1:]
    for c in cards:
        c=c.split('<footer')[0]
        name=clean(re.search(r'<h2>(.*?)</h2>',c,re.S).group(1)) if re.search(r'<h2>(.*?)</h2>',c,re.S) else ""
        det=re.search(r'<div class="teacher-detail">(.*?)</div>\s*</div>',c,re.S)
        lines=[clean(x) for x in re.findall(r'<p[^>]*>(.*?)</p>',det.group(1),re.S)] if det else []
        img=re.search(r'src="(images/Awardees/[^"]+)"',c)
        right=re.search(r'col-lg-9[^>]*>(.*?)(?:<!-- Bottom|<div class="bottom|<!-- Video Link|<div class="text-end)',c,re.S)
        desc=""
        if right:
            ps=re.findall(r'<p[^>]*>(.*?)</p>',right.group(1),re.S); desc=" ".join(clean(p) for p in ps)
            if not desc: desc=clean(right.group(1))
        core=re.search(r'Core area of appreciation</h6>\s*<p[^>]*>(.*?)</p>',c,re.S)
        yt=re.search(r"__doPostBack\(&#39;([^&]+)&#39;",c); ytd=re.search(r'href="(https?://[^"]*(?:youtu|youtube)[^"]*)"',c)
        out.append(dict(cat=cat,year=int(y),name=name,lines=lines,img=img.group(1) if img else "",desc=desc,core=clean(core.group(1)) if core else "",yt_target=yt.group(1) if yt else "",yt_url=ytd.group(1) if ytd else ""))

json.dump(out,open(S+"/raw.json","w"),ensure_ascii=False,indent=1)
import collections;print(collections.Counter((o["cat"],o["year"]) for o in out)); print(sum(1 for o in out if o["yt_target"] or o["yt_url"]),"with yt"); print(json.dumps(out[0],ensure_ascii=False)[:800]); print(json.dumps([o for o in out if o["year"]==2021][3],ensure_ascii=False)[:1200]); print(json.dumps([o for o in out if o["cat"]=="higher"][0],ensure_ascii=False)[:600]); print([o["name"] for o in out if not o["desc"]][:20])
