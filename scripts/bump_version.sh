#!/bin/bash
# Add/refresh a ?v=<timestamp> on CSS/JS links in index.html so browsers load the newest files after a push.
cd "$(dirname "$0")/.."
v=$(date +%Y%m%d%H%M)
sed -E -i '' "s#(href=\"assets/css/[^\"?]+\.css)(\?v=[0-9]+)?\"#\1?v=$v\"#g; s#(src=\"(assets/js|data)/[^\"?]+\.js)(\?v=[0-9]+)?\"#\1?v=$v\"#g" index.html
grep -o '[a-z/]*\.\(css\|js\)?v=[0-9]*' index.html
