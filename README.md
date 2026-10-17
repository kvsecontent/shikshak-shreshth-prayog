# शिक्षक श्रेष्ठ प्रयोग · Shikshak Shreshth Prayog

**राष्ट्रीय शिक्षक पुरस्कार 2021–2026 और विश्व की श्रेष्ठ कक्षा पद्धतियाँ, कक्षा 1–10 में अपनाने के लिए।**
*National Teachers' Award 2021–2026 practices and the world's best classroom practices, ready to adopt in Classes 1–10.*

यह एक स्टैटिक वेबसाइट है (कोई सर्वर या बिल्ड नहीं)। इसे GitHub Pages पर मुफ़्त में होस्ट कर सकते हैं, या सीधे `index.html` खोलकर कंप्यूटर पर चला सकते हैं।

---

## इसमें क्या है (What's inside)

| भाग | विवरण |
|---|---|
| **भारत के पुरस्कृत शिक्षक** | 2021–2026 के 352 पुरस्कृत शिक्षक (281 विद्यालय + 71 उच्च शिक्षा/पॉलिटेक्निक)। हर शिक्षक का आधिकारिक प्रशस्ति-पत्र, फ़ोटो, आधिकारिक YouTube वीडियो (283), हिंदी सार, थीम, कक्षा स्तर, खर्च और **अपनी कक्षा में अपनाने के 3 चरण**। |
| **फ़िल्टर** | वर्ष, श्रेणी, राज्य/संगठन (KVS, NVS, EMRS, सैनिक स्कूल…), 19 थीम, कक्षा स्तर, विषय, खर्च, केवल वीडियो वाले, और खोज। |
| **केंद्रीय विद्यालय (KVS)** | KVS के 10 पुरस्कृत शिक्षक (2021–2026) एक अलग टैब में। |
| **अध्याय व दक्षता (CG)** | कक्षा 1–10 की NCERT (2026-27) पुस्तकों के 315 अध्याय: हर अध्याय के लिए मेल खाती पुरस्कृत व विश्व पद्धतियाँ और NCERT PDF लिंक। कक्षा 3–5 में गणित, TWAU, अंग्रेज़ी, हिंदी की दक्षता (CG/C-x.x) के अनुसार भी। |
| **इस सप्ताह की पद्धति** | होम पेज पर हर सोमवार नई पद्धति, WhatsApp/प्रिंट बटन के साथ। |
| **WhatsApp शेयर** | हर कार्ड पर: पद्धति का नाम, 3 चरण और सीधा लिंक एक संदेश में। |
| **राज्यवार** | नक्शे की जगह राज्य के नाम वाली टाइलें: हर राज्य में वर्षवार संख्या और मुख्य थीम। |
| **थीम** | FLN, कम लागत TLM, समावेशी शिक्षा, बालिका शिक्षा, STEM… हर थीम के उदाहरण। |
| **विश्व की पद्धतियाँ** | 27 प्रमाण-आधारित पद्धतियाँ (जापान, सिंगापुर, फ़िनलैंड, केन्या, कोलंबिया…): शोध प्रमाण, खर्च, भारत में उपयुक्तता और अपनाने के चरण। |
| **ग्लोबल टीचर प्राइज़** | 2015–2026 के विजेता और उनसे क्या सीखें। |
| **इमेज प्रॉम्प्ट स्टूडियो** | किसी भी पद्धति के लिए ChatGPT इमेज हेतु 3 तैयार प्रॉम्प्ट: कक्षा दृश्य, 4 चित्रों की कॉमिक, कक्षा पोस्टर (5 शैलियाँ, 3 आकार, हिंदी/अंग्रेज़ी/बिना शब्द)। |
| **गतिविधि कार्ड प्रिंट** | हर पद्धति का एक पेज का कार्ड, कक्षा में ले जाने के लिए। |
| **मेरा अपनाया** | पद्धतियाँ जोड़ें, स्थिति (आज़माना है / आज़मा लिया / नियमित अपनाया) और नोट लिखें, CSV डाउनलोड करें। (केवल उसी ब्राउज़र में सहेजा जाता है।) |
| **हिंदी + English** | ऊपर दाईं ओर भाषा बदलें। डार्क मोड भी है। |

---

## GitHub Pages पर कैसे लगाएँ (Deploy in 5 minutes)

1. GitHub पर लॉग-इन करें → **New repository** → नाम दें, जैसे `shikshak-shreshth-prayog` → **Public** → Create.
2. इस फ़ोल्डर की सारी फ़ाइलें अपलोड करें (*Add file → Upload files*, या नीचे दिए कमांड)।
3. Repository में **Settings → Pages** खोलें।
4. *Build and deployment* में **Source: Deploy from a branch**, Branch: **main**, फ़ोल्डर: **/ (root)** → **Save**।
5. 1–2 मिनट बाद साइट यहाँ खुलेगी: `https://<आपका-username>.github.io/shikshak-shreshth-prayog/`

Terminal से (अगर git इंस्टॉल है):

```bash
git init && git add . && git commit -m "Shikshak Shreshth Prayog: first version"
```

```bash
git branch -M main && git remote add origin https://github.com/<username>/shikshak-shreshth-prayog.git && git push -u origin main
```

> `.nojekyll` फ़ाइल रखी गई है ताकि GitHub Pages फ़ाइलों को बदले बिना सीधे दिखाए।

### कंप्यूटर पर चलाना (Run locally)

`index.html` पर डबल-क्लिक करें, या:

```bash
python3 -m http.server 8765
```

फिर ब्राउज़र में `http://localhost:8765` खोलें।

---

## फ़ोल्डर संरचना (Structure)

```
index.html               ← पूरा ऐप
assets/css/style.css     ← डिज़ाइन (लाइट/डार्क, मोबाइल, प्रिंट)
assets/js/i18n.js        ← हिंदी/English शब्द, थीम-राज्य-विषय के नाम
assets/js/app.js         ← सारा लॉजिक
data/awardees.js|json|csv      ← 352 शिक्षक (CSV Excel में खुलती है)
data/international.js|json     ← 27 विश्व पद्धतियाँ + ग्लोबल टीचर प्राइज़
data/curriculum.js       ← NCERT अध्याय, CG, और पद्धति-विषय मिलान (scripts/build_curriculum.py से बनता है)
data/working/            ← विश्लेषण की मूल फ़ाइलें (enrich/*.txt, final.json, intl.json)
scripts/build_data.py    ← working → data/*.js, json, csv
scripts/pipeline/        ← पोर्टल से प्रशस्ति व वीडियो लिंक लाने वाली स्क्रिप्टें
```

---

## डेटा अपडेट करना (Updating the data)

**किसी शिक्षक का विश्लेषण बदलना:** `data/working/enrich/eYYYYs.txt` में उस शिक्षक की पंक्ति बदलें। फ़ॉर्मेट (`¦` से अलग 11 खाने):

```
id¦Title (English)¦शीर्षक (हिंदी)¦हिंदी सार¦themes,comma¦Subjects¦1-2,3-5¦cost 0/1/2¦step1;;step2;;step3¦चरण1;;चरण2;;चरण3¦image scene (English)
```

फिर चलाएँ:

```bash
python3 scripts/pipeline/merge.py data/working && python3 scripts/build_data.py data/working
```

(`merge.py` को `data/working/all.json` चाहिए; पूरा pipeline नीचे है।)

**अध्याय/CG मिलान बदलना:** अध्याय व उनके topic `data/working/curriculum_src.py` में, और हर पद्धति के topic `data/working/practice_topics.txt` में (`id: topic1,topic2`) हैं। बदलने के बाद:

```bash
python3 scripts/build_curriculum.py
```

**2026 के आधिकारिक प्रशस्ति-पत्र आने पर / नया वर्ष जोड़ना:** पोर्टल ASP.NET है, इसलिए वर्ष बदलने के लिए "postback" करना पड़ता है। `scripts/pipeline/` में क्रम:

1. `pb.sh <workdir>`: हर वर्ष का TeacherCitation / heawardeecitation पेज लाता है (`workdir/dl/` में)।
2. `parse.py <workdir>`: कार्ड पार्स कर `raw.json` बनाता है (वर्षों की सूची फ़ाइल के ऊपर बदलें)।
3. `yt.sh <workdir>`: हर शिक्षक का YouTube लिंक निकालता है।
4. `base.py <workdir>`: राज्य/संगठन/UDISE निकालकर `base.json`।
5. `y2026.py <workdir>`: जिन शिक्षकों की प्रशस्ति अभी नहीं आई उन्हें जोड़कर `all.json`।
6. नए शिक्षकों के लिए `enrich/*.txt` में पंक्तियाँ लिखें, `chk.py` से जाँचें, फिर `merge.py` और `build_data.py`।

---

## स्रोत और सावधानियाँ (Sources & caveats)

- आधिकारिक प्रशस्ति, फ़ोटो, वीडियो: [nationalawardstoteachers.education.gov.in](https://nationalawardstoteachers.education.gov.in/) (School: TeacherCitation.aspx, Higher Ed: heawardeecitation.aspx), चयन सूची: Download.aspx (2021–2026 PDF)।
- 2026: आधिकारिक सूची (48 विद्यालय) पोर्टल PDF से; 21 उच्च शिक्षा शिक्षक Careers360 (PIB के हवाले से); 16 शिक्षकों का सार The Logical Indian / प्रभात खबर / MoE की X पोस्ट से। बाकी 2026 कार्ड पर "प्रशस्ति प्रतीक्षित" लिखा है।
- पोर्टल पर 2024 का एक प्रोफ़ाइल (H.N. Girish) दो बार है, इसलिए 2024 में 49 प्रोफ़ाइल दिखते हैं।
- कौशल विकास मंत्रालय (MSDE) के ITI प्रशिक्षक पुरस्कार इसमें शामिल नहीं हैं।
- "अपनाने के चरण", थीम, खर्च और हिंदी सार इस प्रोजेक्ट द्वारा प्रशस्ति-पत्र पढ़कर तैयार किए गए सुझाव हैं, शिक्षकों के अपने शब्द नहीं।
- विश्व पद्धतियों के प्रमाण स्तर मुख्यतः [EEF Teaching & Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit), विश्व बैंक/GEEAP "Smart Buys" और प्रकाशित मूल्यांकनों पर आधारित हैं। "+x महीने" जैसे आँकड़े अनुमानित हैं; नवीनतम आँकड़ों के लिए मूल स्रोत देखें।
- इमेज प्रॉम्प्ट किसी वास्तविक शिक्षक का चेहरा या पहचान बनाने को नहीं कहते; वे केवल गतिविधि दिखाते हैं।

## लाइसेंस (License)

कोड: MIT (देखें `LICENSE`)। आधिकारिक प्रशस्ति-पत्र, फ़ोटो और वीडियो शिक्षा मंत्रालय, भारत सरकार के हैं और उनके स्रोत से लिंक/उद्धृत किए गए हैं। विश्लेषण सामग्री (हिंदी सार, चरण, प्रॉम्प्ट) CC BY 4.0 के तहत शिक्षक स्वतंत्र रूप से उपयोग कर सकते हैं।
