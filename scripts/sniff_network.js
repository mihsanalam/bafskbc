const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--window-size=1640,4000',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const targets = await fetch('http://127.0.0.1:9228/json/list').then(r => r.json());
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

    const networkUrls = new Set();
    ws.addEventListener('message', (event) => {
      try {
        const text = typeof event.data === 'string' ? event.data : event.data.toString();
        const data = JSON.parse(text);
        if (data.method === 'Network.requestWillBeSent') {
          const url = data.params?.request?.url;
          if (url && (url.includes('/images/') || url.includes('/assets/'))) {
            networkUrls.add(url);
          }
        }
      } catch (e) {}
    });

    await send('Network.enable');
    await send('Page.enable');
    await send('Page.navigate', { url: 'https://www.projectone.website/' });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll gradually through the whole page
    for (let y = 0; y <= 5000; y += 500) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y});` });
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`Captured ${networkUrls.size} images from network!`);
    fs.writeFileSync('scripts/network_images.json', JSON.stringify([...networkUrls], null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

main();
