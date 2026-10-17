#!/bin/bash
cd "$1/dl"; B=https://nationalawardstoteachers.education.gov.in
run(){ page=$1; shift; rm -f cj.txt; curl -s -m 90 -A "Mozilla/5.0" -c cj.txt -b cj.txt -o base_$page.html $B/$page.aspx
 for y in "$@"; do python3 ../pb.py base_$page.html $y > body.txt; curl -s -m 120 -A "Mozilla/5.0" -c cj.txt -b cj.txt -H "Content-Type: application/x-www-form-urlencoded" --data-binary @body.txt -o ${page}_$y.html $B/$page.aspx; echo $page $y $(wc -c < ${page}_$y.html) $(grep -o 'lblcount">[0-9]*' ${page}_$y.html); done; }
run TeacherCitation 2024 2023 2022 2021
run heawardeecitation 2024 2023
