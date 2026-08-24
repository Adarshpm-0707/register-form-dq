const https = require('https');
const fs = require('fs');

const urls = {
  firefly: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/adobefirefly.svg',
  chatgpt: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openai.svg',
  canva: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/canva.svg',
  gemini: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlegemini.svg',
  midjourney: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/midjourney.svg',
  linkedin: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/linkedin.svg'
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function main() {
  for (const [key, url] of Object.entries(urls)) {
    try {
      const res = await fetchUrl(url);
      console.log(key, res.status, res.data.length);
      if (res.status === 200) {
        fs.writeFileSync(`./scratch/${key}.svg`, res.data);
      }
    } catch (e) {
      console.error(key, e.message);
    }
  }
}

main();
