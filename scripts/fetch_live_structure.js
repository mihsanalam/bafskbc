const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--window-size=1640,2400',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const targets = await fetch('http://127.0.0.1:9226/json/list').then(r => r.json());
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
    // Scroll down to load all lazy components and images
    await new Promise(r => setTimeout(r, 4000));

    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 1500);`
    });
    await new Promise(r => setTimeout(r, 2000));

    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 3000);`
    });
    await new Promise(r => setTimeout(r, 2000));

    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Find the why-us section and portfolio section
          const whyUsEl = document.getElementById('why-us') || document.querySelector('[name="why-us"]') || document.querySelector(':has(h2, h1)');
          
          // Let's find elements that contain "One Purposeful Page"
          const allElements = Array.from(document.querySelectorAll('*'));
          const headlineEl = allElements.find(el => el.children.length === 0 && el.innerText?.includes('One Purposeful Page'));
          
          let whyUsSection = headlineEl;
          while (whyUsSection && whyUsSection.parentElement && !whyUsSection.className?.includes('framer-') && whyUsSection.tagName !== 'SECTION') {
            whyUsSection = whyUsSection.parentElement;
          }
          // go up a few levels to find the section container
          let cur = headlineEl;
          const ancestors = [];
          for (let i = 0; i < 7 && cur; i++) {
            ancestors.push({ tag: cur.tagName, class: cur.className, id: cur.id, text: cur.innerText?.slice(0, 40) });
            cur = cur.parentElement;
          }

          // Let's find all images on the page now after scrolling
          const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.offsetWidth,
            height: img.offsetHeight
          }));

          // Let's find all background-images
          const bgs = Array.from(document.querySelectorAll('*')).map(el => {
            const bg = window.getComputedStyle(el).backgroundImage;
            if (bg && bg.includes('url(')) {
              return { bg, tag: el.tagName, class: el.className, text: el.innerText?.slice(0, 30) };
            }
            return null;
          }).filter(Boolean);

          return { ancestors, imgs, bgs };
        })()
      `,
      returnByValue: true
    });

    fs.writeFileSync('scripts/live_structure.json', JSON.stringify(evalResult.result.value, null, 2));
    console.log('Saved live_structure.json successfully!');
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

main();
