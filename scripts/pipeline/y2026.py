import json, sys
S = sys.argv[1]
LI = "https://thelogicalindian.com/national-teachers-awards-125955/"
PK = "https://www.prabhatkhabar.com/state/uttar-pradesh/up-teachers-national-teacher-award-2026"
VS = "https://www.voiceofsikkim.com/sushma-tamang-national-teachers-award-2026-sikkim/"
LIST = "https://nationalawardstoteachers.education.gov.in/File/Selected_Teachers_2026.pdf"
X = "https://x.com/EduMinOfIndia/status/"

# name, state/org, school, state(for grouping), org, note, source, xpost
school = [
 ("Shri J Prakash Rao","PM SHRI GMSSS Mayabunder, Pokadera","Andaman and Nicobar Islands","","","",""),
 ("Shri Rajesh Kouluri","MPPS Chinamallupeta","Andhra Pradesh","","","",""),
 ("Ms. Yaku Tame","Government Secondary School, G-Sector Naharlagun, Papum Pare","Arunachal Pradesh","","","",""),
 ("Shri Rajesh Bordoloi","Adarsha Tribal Higher Secondary School, Jorhat","Assam","","","",""),
 ("Ms. Khushboo Kumari","Urdu Primary School Bidaydih","Bihar","","","",""),
 ("Ms. Pushpa Prasad","Middle School Kuchaikote Kanya, Kuchaikote","Bihar","","","",""),
 ("Ms. Radha Rajesh","New Horizon Public School, Indiranagar","Karnataka","CISCE","","",""),
 ("Ms. Sangeeta Yadav","St. Joseph's Convent Sr. Sec. School, Idgah Hills, Bhopal","Madhya Pradesh","CBSE",
  "Transformed mathematics learning by moving away from rote memorisation towards exploration and problem-solving. Through initiatives such as GANITOTSAV, MathEMind and Mathletics she encourages critical thinking, creativity and collaboration among students.",LI,""),
 ("Shri Ravi Jaiswal","Govt. Model High School, Maloya Colony","Chandigarh","","","",""),
 ("Ms. Sunita Yadav","Govt. M.S. Khichari","Chhattisgarh","",
  "Built a smart classroom with community support and expanded community initiatives such as Nyota Bhojan and home-reading campaigns, showing how school–community collaboration can strengthen learning.",LI,""),
 ("Ms. Patel Purnima Mohanlal","GHS Dalwada","Dadra and Nagar Haveli and Daman and Diu","","","",""),
 ("Ms. Suman Goel","GSKV Pooth Kalan","Delhi","","","",""),
 ("Md. Zafar Alam","EMRS Karanjia, Binuria (Tato)","Odisha","EMRS",
  "Over two decades at EMRS Karanjia, he combined technology, sports and tribal heritage to support students beyond academics. Under his leadership the school reached 100% Class X results and won 16 national sports medals; he also improved enrolment, ran anti-addiction drives and guided students to higher education.",LI,""),
 ("Shri Mahadev Hanamant Shinde","Gujarati Samaj Special School, Aquem","Goa","",
  "Focused on inclusive education by developing digital and activity-based learning resources for children with disabilities, and supports other educators in making classrooms more inclusive.",LI,""),
 ("Shri Nitinkumar Mahendrakumar Pathak","Rangpur Primary School, Rangpur","Gujarat","","","",""),
 ("Shri Anil Kaushik","GMSSSS Sanghi, Rohtak","Haryana","","","",""),
 ("Ms. Manjari V Mahajan","Government Senior Secondary School, Bhaleth","Himachal Pradesh","","","",""),
 ("Mohd Ayaz Raina","HSS Dalhori","Jammu and Kashmir","","","",""),
 ("Ms. Munmun Bhattacherjee","MS Barmasia, Dhanbad","Jharkhand","",
  "Empowers a vulnerable coal-mining community through education. Aligned with NEP 2020 and NIPUN Bharat, she uses low-cost FLN tools, art-integrated learning and vocational exposure to close poverty-linked learning gaps; her students have become young artists, NEET aspirants and self-reliant vocational entrepreneurs.",LI,""),
 ("Ms. Rathnakumari S","Government Higher Primary School Samatagaru, Honnebailu","Karnataka","","","",""),
 ("Ms. Amutha J","PM SHRI Kendriya Vidyalaya No. 2, Madurai","Tamil Nadu","KVS","","",""),
 ("Dr. Manisha Khetrapal","PM SHRI KV NFR Rangiya","Assam","KVS","","",""),
 ("Shri Sunil Kumar KP","GHSS Irikkur","Kerala","","","",""),
 ("Shri Mohd Mustafa Kumal","Govt. Middle School Zgangjing, Sankoo","Ladakh","","","",""),
 ("Dr. Archana Shukla","Govt. Mahatma Gandhi Sandipani Hr. Sec. School, BHEL Bhopal","Madhya Pradesh","","","",""),
 ("Shri Shailendra Pratap Singh","Government Middle School Kanjwar, Majhauli, Sidhi","Madhya Pradesh","","","",""),
 ("Dr. Kavita Narsingrao Gitte","Sane Guruji Niwasi Vidyalaya, Kaij","Maharashtra","","","",""),
 ("Ms. Kunda Jayawant Bachhav","NMC School No. 18, Anandwalli, Nashik","Maharashtra","","","",""),
 ("Shri Wanglembam Gobin Singh","Laikon Upper Primary School, Kongba","Manipur","","","",""),
 ("Ms. Lalnunmawii","Government Electric Veng High School","Mizoram","","","",""),
 ("Shri R Ronald Meru","GHSS Sechu Zubza","Nagaland","","","",""),
 ("Shri Vaibhav Vasantrao Kulkarni","PM SHRI JNV Latur","Maharashtra","NVS",
  "Made mathematics more accessible by creating 700+ open-access mathematics videos that help students and teachers understand concepts beyond the classroom.",LI,""),
 ("Shri Padaraj Umakanta Nayak","Government High School Alipingal","Odisha","","","",""),
 ("Shri Ganesan S","Viduthalai Veerar R Seenuvasan Govt. High School, Mettupalayam","Puducherry","","","",""),
 ("Shri Dinesh Kumar","Govt. Victoria Girls Senior Secondary School, Patiala","Punjab","","","",""),
 ("Dr. Divyendu Sen","Mahatma Gandhi Government School, Pachpahar, Jhalawar","Rajasthan","",
  "Biology lecturer who brought students into a NASA-supported citizen-science asteroid search campaign; since the COVID-19 period his students have identified 12 asteroid candidates, four with provisional recognition. Also known for work on scientific research and educational equity.",LI,""),
 ("Dr. Vartika Gulati","GGUPS Tumli Ka Bas, Chaksu, Jaipur","Rajasthan","","","",""),
 ("Shri Shivprasad Arvind Tingare","Sainik School Satara","Maharashtra","Sainik School",
  "Recognised for hands-on science education, low-cost instructional design and interactive digital learning; over twelve years his mentorship helped 100+ cadets get selected as officers.",LI,""),
 ("Ms. Sushma Tamang","PM SHRI Govt. Senior Secondary School, Dikling, Pakyong","Sikkim","",
  "PGT Chemistry working with remote learners through peer-led education; guides students to national and global competitions and promotes climate education.",LI,""),
 ("Shri Thanga Raj M","Panchayat Union Primary School, Puliyampatti","Tamil Nadu","","","",""),
 ("Ms. Bhavani Bompelly","MPPS Girls Gandhari, Kamareddy","Telangana","",
  "Scaled school enrolment from 40 to 130 children, pioneered pre-primary education and created play-based, digital learning environments that make mathematics and languages easier for young children.",LI,""),
 ("Shri Ranjan Debnath","PM SHRI Sabroom Girls HS School","Tripura","","","",""),
 ("Dr. Renu Tripathi","Govt. Balika Inter College, Vijay Nagar, Ghaziabad","Uttar Pradesh","",
  "Brought drop-out and out-of-school children from about 60 villages back into education; emphasises STEM, Atal Tinkering Labs and low-cost teaching material to build innovation and problem-solving.",PK,""),
 ("Dr. Iftkhar Khan","Government Inter College, Jagdishpur, Ballia","Uttar Pradesh","",
  "Takes learning beyond the classroom through free Sunday art classes that build students' creativity, plus initiatives on road safety, environment protection and social awareness.",PK,""),
 ("Ms. Shalini Kushwaha","Composite School Rasoolabad, Koilaha, Kaushambi","Uttar Pradesh","",
  "Links technology and creative activities with lessons, using digital resources and AI-based tools to make learning easy and joyful; her school earned 'NIPUN Vidyalaya' recognition.",PK,""),
 ("Shri Gabar Singh","Govt. UPS Musyakhand, Maira","Uttarakhand","","","",""),
 ("Shri Palash Chowdhury","Sri Ramkrishna Sarada Vidyapith Primary School, Purba Bardhaman","West Bengal","",
  "Improves student nutrition (he and a colleague contribute about Rs 60,000 a month for breakfast for 300 students), advances digital education and runs inclusive, community-driven school development including CPR and AI sessions for mothers.",LI,""),
 ("Shri Santanu Patra","Govt. Model School, Nayagram Block","West Bengal","","","",""),
]

he = [
 ("Prof. Avlokita Agrawal","IIT Roorkee","Uttarakhand","Sustainable Architecture and Built Environment"),
 ("Prof. Kirti Chandra Sahu","IIT Hyderabad","Telangana","Chemical Engineering"),
 ("Prof. Vinay Chamola","BITS Pilani","Rajasthan","Electrical & Electronics Engineering"),
 ("Dr. Srikant Gollapudi","IIT Bhubaneswar","Odisha","Metallurgy & Materials Science"),
 ("Dr. Mithun Radhakrishna","IIT Gandhinagar","Gujarat","Chemical Engineering"),
 ("Prof. Sourav Datta","IISER Bhopal","Madhya Pradesh","Plant Sciences"),
 ("Prof. Vikram Vishal","IIT Bombay","Maharashtra","Earth Sciences"),
 ("Prof. Sarvaiya Jayrajsinh Indrajitsinh","National Forensic Sciences University, Gandhinagar","Gujarat","Forensic Pharmacy and Food Forensics"),
 ("Prof. Sankar Prasad Rath","IIT Kanpur","Uttar Pradesh","Chemical Sciences"),
 ("Dr. Manisha Nigam","HNB Garhwal University, Srinagar","Uttarakhand","Biochemistry"),
 ("Dr. Amar Mohanrao Taksande","Jawaharlal Nehru Medical College, Wardha","Maharashtra","Medicine – Paediatrics"),
 ("Dr. Arun Babu","AIIMS Mangalagiri","Andhra Pradesh","Medicine – Paediatrics"),
 ("Dr. Pukhrambam Lilabati Devi","Dept. of Dance and Music, Manipur University, Imphal","Manipur","Manipuri Dance"),
 ("Prof. Ashutosh Mohan","Institute of Management Studies, BHU, Varanasi","Uttar Pradesh","Management"),
 ("Prof. Ankuran Dutta","Gauhati University, Guwahati","Assam","Mass Communication"),
 ("Ms. Shivani V.","Karnataka Sanskrit University, Bengaluru","Karnataka","Sanskrit"),
 ("Prof. Rajeev Choudhary","Pt. Ravishankar Shukla University, Raipur","Chhattisgarh","Physical Education, Yoga Education"),
 ("Dr. Vishwanatha H. S.","M.E.I. Polytechnic, Bengaluru","Karnataka","Civil Engineering"),
 ("Dr. Sasikala S.","PSG Polytechnic College, Coimbatore","Tamil Nadu","Electrical & Electronics Engineering"),
 ("Dr. Kannan Rathinam","Sakthi Polytechnic College, Erode","Tamil Nadu","Physics"),
 ("Dr. Sandipann Pralhad Narote","Government Polytechnic, Solapur","Maharashtra","Electronics & Telecommunication Engineering"),
]
C360 = "https://news.careers360.com/national-teachers-award-2026-21-heis-polytechnics-iits-medical-colleges-state-universities-president-murmu-sep-5"
HE_NOTE = {
 "Prof. Ashutosh Mohan": ("About 25 years of teaching with research at the core; 50+ research papers in management education.", PK),
 "Prof. Sankar Prasad Rath": ("Recognised for research in chemistry and an effective teaching approach that builds students' talent.", PK),
}
out = []
for i, (n, sch, st, org, note, src, xp) in enumerate(school, 1):
    out.append(dict(id=f"s2026-{i:02d}", cat="school", year=2026, name=n, role="", disc="", school=sch, addr="", state=st, org=org,
                    udise="", photo="", citation=note, core="", cit_status=("news" if note else "awaited"), cit_src=src or LIST,
                    yt=dict(id="", list="", index=0)))
for i, (n, inst, st, d) in enumerate(he, 1):
    note, src = HE_NOTE.get(n, ("", ""))
    out.append(dict(id=f"h2026-{i:02d}", cat="higher", year=2026, name=n, role="", disc=d, school=inst, addr="", state=st, org="",
                    udise="", photo="", citation=note, core="", cit_status=("news" if note else "awaited"), cit_src=src or C360,
                    yt=dict(id="", list="", index=0)))
base = json.load(open(S + "/base.json"))
for r in base:
    r["cit_status"] = "official"
    r["cit_src"] = "https://nationalawardstoteachers.education.gov.in/" + ("TeacherCitation.aspx" if r["cat"] == "school" else "heawardeecitation.aspx")
    r.pop("src_index", None)
allr = base + out
json.dump(allr, open(S + "/all.json", "w"), ensure_ascii=False, indent=1)
print(len(allr), sum(1 for r in out if r["cit_status"] == "news"))
