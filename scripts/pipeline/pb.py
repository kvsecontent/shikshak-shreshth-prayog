import re,sys,html,urllib.parse
t=open(sys.argv[1],encoding="utf-8",errors="ignore").read(); y=sys.argv[2]
d={}
for m in re.finditer(r'<input[^>]+type="hidden"[^>]*>',t):
    n=re.search(r'name="([^"]+)"',m.group(0)); v=re.search(r'value="([^"]*)"',m.group(0))
    if n: d[n.group(1)]=html.unescape(v.group(1)) if v else ""
sel=re.search(r'<select name="([^"]+)"',t).group(1)
d["__EVENTTARGET"]=sel; d["__EVENTARGUMENT"]=""; d[sel]=y
sys.stdout.write(urllib.parse.urlencode(d))
