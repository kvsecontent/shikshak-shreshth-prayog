import json,re,sys
S=sys.argv[1]
o=json.load(open(S+"/raw.json"))
STATES=["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]
ALIAS={"Jammu & Kashmir":"Jammu and Kashmir","J&K":"Jammu and Kashmir","Orissa":"Odisha","Pondicherry":"Puducherry","A and N":"Andaman and Nicobar Islands","A & N":"Andaman and Nicobar Islands","Andaman":"Andaman and Nicobar Islands","Daman":"Dadra and Nagar Haveli and Daman and Diu","Silvassa":"Dadra and Nagar Haveli and Daman and Diu","Dadra":"Dadra and Nagar Haveli and Daman and Diu","Keralam":"Kerala","Uttaranchal":"Uttarakhand","Mumbai":"Maharashtra","Bengaluru":"Karnataka","Bangalore":"Karnataka","Chennai":"Tamil Nadu","Kolkata":"West Bengal","Hyderabad":"Telangana","New Delhi":"Delhi","Varanasi":"Uttar Pradesh","Kanpur":"Uttar Pradesh","Roorkee":"Uttarakhand","Guwahati":"Assam","Kharagpur":"West Bengal","Madras":"Tamil Nadu","Pune":"Maharashtra","Gandhinagar":"Gujarat","Indore":"Madhya Pradesh","Bhopal":"Madhya Pradesh","Jodhpur":"Rajasthan","Ropar":"Punjab","Mandi":"Himachal Pradesh","Tirupati":"Andhra Pradesh","Palakkad":"Kerala","Bhubaneswar":"Odisha","Patna":"Bihar","Dhanbad":"Jharkhand","Goa":"Goa","Delhi":"Delhi","Pilani":"Rajasthan","Manipal":"Karnataka","Mysuru":"Karnataka","Udupi":"Karnataka"}
def find_state(text):
    best=None;pos=-1
    for s in STATES+list(ALIAS):
        for m in re.finditer(r'(?i)(?<![A-Za-z])'+re.escape(s)+r'(?![A-Za-z])',text):
            if m.start()>=pos: 
                if best is None or m.start()>pos or len(s)>len(best): best=s;pos=m.start()
    return ALIAS.get(best,best) if best else ""
def org_of(t):
    T=t.upper()
    if "KENDRIYA" in T or re.search(r'\bKV\b',T): return "KVS"
    if "NAVODAYA" in T or re.search(r'\bJNV\b',T): return "NVS"
    if "SAINIK" in T: return "Sainik School"
    if "EKLAVYA" in T or "EMRS" in T: return "EMRS"
    if "ATOMIC ENERGY" in T or "AECS" in T: return "AEES"
    return ""
out=[];seen=set()
for i,x in enumerate(o):
    key=(x['year'],x['name'],x['desc'][:80])
    if key in seen: continue
    seen.add(key)
    if not x['name']:
        m=re.match(r'((?:Mr|Ms|Mrs|Dr|Shri|Smt)\.? [A-Z][\w.]*(?: [A-Z][\w.]*){0,3}?) (?:is|has|,)',x['desc']); x['name']=m.group(1).rstrip('.')+'.' if m and m.group(1).endswith(' S') else (m.group(1) if m else '')
    lines=[l for l in x['lines'] if l]
    udise=""; rest=[]
    for l in lines:
        m=re.search(r'UDISE\s*[:\-]?\s*(\d{11})',l,re.I)
        if m: udise=m.group(1); l=re.sub(r'(?i)UDISE\s*[:\-]?\s*\d{11}\s*\|?','',l).strip(' |')
        if l: rest.append(l)
    role=""; 
    if x['cat']=="school" and rest and len(rest[0])<45 and not re.search(r'(?i)school|vidyal|college|gsss|gps|ups|ghs|mps|zp|primary|academy',rest[0]) and len(rest)>=3:
        role=rest.pop(0)
    disc=""
    if x['cat']=="higher" and rest and rest[0].startswith('['): disc=rest.pop(0).strip('[]')
    if x['cat']=="higher" and rest and not disc and len(rest)>=2: role=rest.pop(0)
    school=rest[0] if rest else ""
    addr=", ".join(rest[1:]) if len(rest)>1 else ""
    pin=re.search(r'(\d{6})\s*$'," ".join(rest)); 
    st=find_state(" ".join(rest)) or find_state(x['desc'][:400])
    out.append(dict(id=f"{x['cat'][0]}{x['year']}-{len([y for y in out if y['year']==x['year'] and y['cat']==x['cat']])+1:02d}",
        cat=x['cat'],year=x['year'],name=x['name'],role=role,disc=disc,school=school,addr=addr,state=st,org=org_of(" ".join(rest)),udise=udise,
        photo=("https://nationalawardstoteachers.education.gov.in/"+x['img']) if x['img'] else "",citation=x['desc'],core=x['core'],src_index=i))
# yt
yt={}
for l in open(S+"/dl/ytres.txt"):
    a,u=(l.rstrip("\n").split("\t")+[""])[:2]; yt[int(a)]=u
for r in out:
    u=yt.get(r['src_index'],"")
    vid=re.search(r'(?:v=|embed/)([A-Za-z0-9_-]{11})',u); lst=re.search(r'list=([A-Za-z0-9_-]+)',u); idx=re.search(r'index=(\d+)',u)
    r['yt']=dict(id=vid.group(1) if vid else "",list=lst.group(1) if lst else "",index=int(idx.group(1)) if idx else 0)
import collections
c=collections.Counter(r['yt']['id'] for r in out if r['yt']['id'])
for r in out:
    if c[r['yt']['id']]>1 and r['yt']['index']==0: r['yt']['dup']=True
print(len(out), collections.Counter((r['cat'],r['year']) for r in out))
print([ (r['name'],r['addr'],r['school']) for r in out if not r['state']])
print(collections.Counter(r['state'] for r in out).most_common(50))
print(collections.Counter(r['org'] for r in out))
json.dump(out,open(S+"/base.json","w"),ensure_ascii=False,indent=1)
