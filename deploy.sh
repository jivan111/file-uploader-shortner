#!/bin/bash

echo "Change directory"
cd AP_Backend

echo "Pull latest code"
git pull origin development

echo "Install dependencies"
npm install

echo "Generate Build"
npm run build

echo "Restart PM2 Process"
pm2 restart Backend