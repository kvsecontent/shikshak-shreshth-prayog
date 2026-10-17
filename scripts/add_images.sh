#!/bin/bash
# Convert images in images/incoming/ (named <practice-id>.png|jpg|jpeg|webp|heic) to
# 1280px-wide JPG in images/practices/, then remove the originals. macOS (uses sips).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IN="$ROOT/images/incoming"; OUT="$ROOT/images/practices"
shopt -s nullglob nocaseglob
n=0
for f in "$IN"/*.{png,jpg,jpeg,webp,heic}; do
  id="$(basename "${f%.*}")"
  if ! grep -q "\"id\":\"$id\"" "$ROOT/data/awardees.js" && ! grep -q "\"id\":\"$id\"" "$ROOT/data/international.js"; then
    echo "SKIP  $(basename "$f")  — '$id' किसी पद्धति का ID नहीं है"; continue
  fi
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  if [ "${w:-0}" -gt 1280 ]; then resize=(--resampleWidth 1280); else resize=(); fi
  sips -s format jpeg -s formatOptions 80 "${resize[@]}" "$f" --out "$OUT/$id.jpg" >/dev/null
  rm -f "$OUT/$id.png" "$OUT/$id.webp"
  rm "$f"; n=$((n+1)); echo "OK    $id.jpg  ($(du -h "$OUT/$id.jpg" | cut -f1))"
done
echo "$n इमेज तैयार। अब GitHub पर push करें: git add images && git commit -m 'Add practice images' && git push"
