#!/bin/bash
S=$1; cd $S/dl; B=https://nationalawardstoteachers.education.gov.in
python3 -c "
import json;o=json.load(open('$S/raw.json'))
for i,x in enumerate(o):
  if x['yt_target']: print(i,x['cat'],x['year'],x['yt_target'])" > ytjobs.txt
: > ytres.txt
while read i cat y tgt; do
  if [ $cat = school ]; then page=TeacherCitation; else page=heawardeecitation; fi
  if [ $y = 2025 ]; then src=$([ $cat = school ] && echo TeacherCitation.html || echo heawardeecitation.html); else src=${page}_$y.html; fi
  python3 ../pbt.py $src "$tgt" $y > body_$i.txt
  url=$(curl -s -m 60 -A "Mozilla/5.0" -H "Content-Type: application/x-www-form-urlencoded" --data-binary @body_$i.txt $B/$page.aspx | grep -o 'iframe src="[^"]*"' | head -1 | sed 's/iframe src="//;s/"$//')
  echo "$i	$url" >> ytres.txt; rm -f body_$i.txt
done < ytjobs.txt
echo DONE
