const { spawn } = require('child_process');
const fs = require('fs');

async function runSession(action) {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9250',
    '--disable-gpu',
    '--window-size=1640,1050',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const targets = await fetch('http://127.0.0.1:9250/json/list').then(r => r.json());
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

async function captureAll() {
  await runSession(async (send) => {
    // 1. Desktop 1640x1050 Viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1640,
      height: 1050,
      deviceScaleFactor: 2,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(r => setTimeout(r, 2000));

    const targets = [
      { id: 'testimonials', file: 'preview-sec1-testimonials.png' },
      { id: 'social-feed', file: 'preview-sec2-social.png' },
      { id: 'directory', file: 'preview-sec3-directory.png' },
      { id: 'nyc-path', file: 'preview-sec4-nyc.png' },
      { id: 'footer', file: 'preview-sec5-footer.png' }
    ];

    for (const item of targets) {
      const expr = item.id
        ? `document.getElementById('${item.id}').scrollIntoView({ behavior: 'instant', block: 'start' });`
        : `document.querySelector('${item.selector}').scrollIntoView({ behavior: 'instant', block: 'center' });`;
      await send('Runtime.evaluate', { expression: expr });
      await new Promise(r => setTimeout(r, 800));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(item.file, Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${item.file}`);
    }

    // Test hovering over OKAYDEV wordmark
    await send('Runtime.evaluate', {
      expression: `(() => {
        const letters = Array.from(document.querySelectorAll('.logo-letter'));
        console.log('Found logo letters count:', letters.length);
        const trigger = document.querySelector('[data-bento-made-on-logo]');
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          // Dispatch pointerover on middle letter 'Y'
          const yLetter = document.querySelector('.logo-letter[data-letter="Y"]');
          if (yLetter) {
            const yr = yLetter.getBoundingClientRect();
            trigger.dispatchEvent(new PointerEvent('pointerenter', { clientX: yr.left + yr.width/2, clientY: yr.top + yr.height/2 }));
            trigger.dispatchEvent(new PointerEvent('pointermove', { clientX: yr.left + yr.width/2, clientY: yr.top + yr.height/2 }));
          }
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 120));
    const animatedShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-footer-animated.png', Buffer.from(animatedShot.data, 'base64'));
    console.log('Saved preview-footer-animated.png');

    // Capture Full Page
    const fullPageShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync('preview-fullpage-all.png', Buffer.from(fullPageShot.data, 'base64'));
    console.log('Saved preview-fullpage-all.png');
  });

  console.log('All screenshots captured successfully!');
}

captureAll().catch(console.error);
