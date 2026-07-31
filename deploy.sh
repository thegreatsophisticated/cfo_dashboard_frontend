#!/bin/bash
npm run build
git add .next/ -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin development
git checkout main
git merge development
git push origin main
git checkout development
echo "✅ Pushed! Now run: git pull origin main && pm2 restart cfo-app on prod"
