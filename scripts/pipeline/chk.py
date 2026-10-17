import sys,glob
T=set("fln tlm exp art sport ict stem incl comm girl env lead multi lang value career wellbeing assess research vocational".split())
for f in sorted(glob.glob(sys.argv[1]+"/enrich/*.txt")):
    n=0
    for ln,l in enumerate(open(f),1):
        l=l.rstrip("\n")
        if not l: continue
        p=l.split("¦"); n+=1
        if len(p)!=11: print(f,ln,"fields",len(p)); continue
        bad=[t for t in p[4].split(",") if t not in T]
        if bad: print(f,ln,"theme",bad)
        if len(p[8].split(";;"))!=len(p[9].split(";;")): print(f,ln,"steps mismatch")
    print(f.split("/")[-1],n)
