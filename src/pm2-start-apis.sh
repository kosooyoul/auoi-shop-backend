pm2 start apis.js -l ../logs/auoi-apis-log.$(date +%Y%m%d).log -o ../logs/auoi-apis-out.$(date +%Y%m%d).log -e ../logs/auoi-apis-err.$(date +%Y%m%d).log