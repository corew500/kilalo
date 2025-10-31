#!/bin/bash
export PATH="/Users/coreywest/.npm-global/bin:$PATH"

mkdir -p lighthouse-reports/production

pages=(
  "en:home-en"
  "fr:home-fr"
  "en/about:about-en"
  "fr/about:about-fr"
  "en/services:services-en"
  "fr/services:services-fr"
  "en/contact:contact-en"
  "fr/contact:contact-fr"
  "en/community:community-en"
  "fr/community:community-fr"
  "en/programs:programs-en"
  "fr/programs:programs-fr"
)

echo "Running Lighthouse audits on PRODUCTION (kilalo.vercel.app)..."
echo ""

for page in "${pages[@]}"; do
  IFS=':' read -r url name <<< "$page"
  echo "Auditing: $name (/$url)"

  /Users/coreywest/.npm-global/bin/lighthouse "https://kilalo.vercel.app/$url" \
    --output=json \
    --output=html \
    --output-path="./lighthouse-reports/production/$name" \
    --chrome-flags="--headless" \
    --only-categories=performance,accessibility,best-practices,seo \
    --quiet

  echo "✓ $name complete"
done

echo ""
echo "================================================"
echo "PRODUCTION LIGHTHOUSE AUDIT RESULTS"
echo "================================================"
printf "%-20s | %-4s | %-4s | %-4s | %-4s\n" "Page" "Perf" "A11y" "Best" "SEO"
echo "------------------------------------------------"

for page in "${pages[@]}"; do
  IFS=':' read -r url name <<< "$page"
  json_file="./lighthouse-reports/production/$name.report.json"

  if [ -f "$json_file" ]; then
    perf=$(jq -r '.categories.performance.score * 100 | floor' "$json_file")
    a11y=$(jq -r '.categories.accessibility.score * 100 | floor' "$json_file")
    best=$(jq -r '.categories."best-practices".score * 100 | floor' "$json_file")
    seo=$(jq -r '.categories.seo.score * 100 | floor' "$json_file")

    printf "%-20s | %-4s | %-4s | %-4s | %-4s\n" "$name" "$perf" "$a11y" "$best" "$seo"
  fi
done

echo "================================================"
echo ""
echo "Extracting Core Web Vitals from home-en..."
jq '.audits | {
  fcp: .["first-contentful-paint"].displayValue,
  lcp: .["largest-contentful-paint"].displayValue,
  cls: .["cumulative-layout-shift"].displayValue,
  tti: .["interactive"].displayValue,
  tbt: .["total-blocking-time"].displayValue,
  si: .["speed-index"].displayValue
}' ./lighthouse-reports/production/home-en.report.json
