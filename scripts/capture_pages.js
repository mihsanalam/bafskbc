const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 9235;

async function runSession(action) {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then(r => r.json());
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
        } catch (e) { reject(e); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await action(send);

    ws.close();
  } catch (err) {
    console.error('Session error:', err);
  } finally {
    chrome.kill();
  }
}

async function capture() {
  const routes = [
    { url: 'http://localhost:3000/', name: 'preview-iitian-home.png' },
    { url: 'http://localhost:3000/resources', name: 'preview-iitian-resources.png' },
    { url: 'http://localhost:3000/resources/quiz', name: 'preview-iitian-quiz.png' },
    { url: 'http://localhost:3000/resources/roadmap', name: 'preview-iitian-roadmap.png' },
    { url: 'http://localhost:3000/blog', name: 'preview-iitian-blog.png' },
    { url: 'http://localhost:3000/about', name: 'preview-iitian-about.png' },
    { url: 'http://localhost:3000/contact', name: 'preview-iitian-contact.png' }
  ];

  await runSession(async (send) => {
    // 1. Set Desktop 1440x960
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 960,
      deviceScaleFactor: 2,
      mobile: false
    });

    for (const r of routes) {
      console.log(`Navigating to ${r.url}...`);
      await send('Page.navigate', { url: r.url });
      await new Promise(res => setTimeout(res, 1200));

      const screenshot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });

      fs.writeFileSync(r.name, Buffer.from(screenshot.data, 'base64'));
      console.log(`Saved ${r.name}`);
    }

    // Mobile preview of homepage
    console.log('Capturing mobile view (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(res => setTimeout(res, 1200));

    const mobileScreenshot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    fs.writeFileSync('preview-iitian-mobile.png', Buffer.from(mobileScreenshot.data, 'base64'));
    console.log('Saved preview-iitian-mobile.png');
  });
}

capture().then(() => console.log('All screenshots completed!'));
