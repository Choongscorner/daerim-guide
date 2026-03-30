import puppeteer from 'puppeteer';
import fs from 'fs';
import https from 'https';

const queries = [
  { q: "대림동 린궁즈멘관 샤오롱바오", file: "xiaolongbao.png" },
  { q: "대림동 줘마양다리구이", file: "lamb_leg.png" },
  { q: "대림동 사천요리기와집 마파두부", file: "mapo_tofu.png" },
  { q: "대림동 봉선마라탕", file: "maratang.png" },
  { q: "대림동 홍중샤브샤브", file: "hotpot.png" },
  { q: "대림동 뤄웨이도삭면", file: "dosakmyeon.png" },
  { q: "대림동 고향소탕집", file: "beef_soup.png" },
  { q: "대림 중앙시장 연변순대", file: "yanbian_sundae.png" },
  { q: "대림동 원조 강뚝 꼬치구이", file: "lamb_skewers.png" },
  { q: "대림동 대식대 냉면구이", file: "cold_noodle.png" }
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, function(response) {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirects
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', err => {
          fs.unlink(dest, () => reject(err));
        });
      } else {
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      }
    }).on('error', function(err) {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  console.log("Starting Chrome...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Fake User-Agent to ensure we get desktop/mobile image site cleanly
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (let {q, file} of queries) {
    try {
      console.log(`Searching for: ${q}`);
      await page.goto(`https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${encodeURIComponent(q)}`, { waitUntil: 'domcontentloaded' });
      
      // Wait for the naver image element
      await page.waitForSelector('img._image._listImage', { timeout: 5000 });
      
      const imageSrc = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img._image._listImage');
        // Get the first one that has a real source that isn't a blank placeholder
        for (let img of imgs) {
           if (img.src && typeof img.src === 'string' && img.src.startsWith('http')) {
               // Sometimes Naver uses data-lazy-src
               return img.getAttribute('data-lazy-src') || img.src;
           }
        }
        return null;
      });
      
      if (imageSrc) {
        console.log(`Downloading ${imageSrc.substring(0, 50)}... to ${file}`);
        await download(imageSrc, `public/${file}`);
      } else {
        console.log(`No image found for ${q}`);
      }
    } catch (e) {
      console.error(`Error on ${q}: ${e.message}`);
    }
  }
  await browser.close();
  console.log("Done fetching real images.");
})();
