const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--window-size=1640,3000',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const targets = await fetch('http://127.0.0.1:9227/json/list').then(r => r.json());
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (event) => {
        try {
          const text = typeof event.data === 'string' ? event.data : event.data.toString();
          const data = JSON.parse(text);
          if (data.id === curId) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        } catch (e) {
          reject(e);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await new Promise(r => {
      if (ws.readyState === 1) r();
      else ws.addEventListener('open', r, { once: true });
    });

    await send('Page.enable');
    await send('Page.navigate', { url: 'https://www.projectone.website/#why-us' });
    await new Promise(r => setTimeout(r, 4000));

    // Scroll through the page to trigger all lazy-loaded elements
    for (let scrollY = 0; scrollY <= 4000; scrollY += 800) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY});` });
      await new Promise(r => setTimeout(r, 800));
    }

    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Find all images that are part of the portfolio grid (16x, 100+, Trail Homes, Felty, Situate, etc.)
          const portfolioImages = [];
          const allImgs = Array.from(document.querySelectorAll('img'));
          allImgs.forEach(img => {
            portfolioImages.push({
              src: img.src,
              alt: img.alt,
              w: img.offsetWidth,
              h: img.offsetHeight,
              rect: img.getBoundingClientRect(),
              parentClasses: img.parentElement?.className
            });
          });

          // Check if there are background images on cards
          const cardsWithBg = [];
          document.querySelectorAll('*').forEach(el => {
            const bg = window.getComputedStyle(el).backgroundImage;
            if (bg && bg.includes('framerusercontent.com')) {
              cardsWithBg.push({
                bg,
                tag: el.tagName,
                rect: el.getBoundingClientRect(),
                text: el.innerText?.slice(0, 50)
              });
            }
          });

          return { portfolioImages, cardsWithBg };
        })()
      `,
      returnByValue: true
    });

    fs.writeFileSync('scripts/portfolio_assets.json', JSON.stringify(evalResult.result.value, null, 2));
    console.log('Saved scripts/portfolio_assets.json!');
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

main();
