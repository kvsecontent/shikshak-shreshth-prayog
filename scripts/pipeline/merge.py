import json,glob,sys,collections
S=sys.argv[1]
o=json.load(open(S+"/all.json"))
E={}
for f in glob.glob(S+"/enrich/*.txt"):
    for l in open(f):
        l=l.rstrip("\n")
        if not l: continue
        p=l.split("¦")
        E[p[0]]=dict(t_en=p[1],t_hi=p[2],s_hi=p[3],themes=p[4].split(","),subj=[x.strip() for x in p[5].split(",")],grades=p[6].split(","),cost=int(p[7]),steps_en=p[8].split(";;"),steps_hi=p[9].split(";;"),scene=p[10])
ids={r['id'] for r in o}
print("enrich not in data:",[k for k in E if k not in ids])
FIX={"s2022-05":dict(school="Joypur Primary School",role="Primary School Teacher")}
for r in o:
    if r['id'] in FIX: r.update(FIX[r['id']])
    if r['id'] in E: r.update(E[r['id']])
miss=[r['id'] for r in o if r['id'] not in E and r['cit_status']!='awaited']
print("missing enrichment (non-awaited):",miss)
print(collections.Counter((r['cat'],r['year'],r['cit_status']) for r in o))
json.dump(o,open(S+"/final.json","w"),ensure_ascii=False)
