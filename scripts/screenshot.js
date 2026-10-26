const { spawn } = require('child_process');
const fs = require('fs');

async function runSession(action) {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--window-size=1640,1050',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const targets = await fetch('http://127.0.0.1:9230/json/list').then(r => r.json());
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
    console.error(err);
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

    // Capture Hero
    const heroShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-hero.png', Buffer.from(heroShot.data, 'base64'));
    console.log('Saved preview-hero.png');

    // Scroll to #why-us (matches Screenshot 1)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('why-us').scrollIntoView({ behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 1200));
    const whyUsShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-why-us.png', Buffer.from(whyUsShot.data, 'base64'));
    console.log('Saved preview-why-us.png');

    // Scroll to #portfolio-grid (matches Screenshot 2)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('portfolio-grid').scrollIntoView({ behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 1200));
    const portfolioShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-portfolio.png', Buffer.from(portfolioShot.data, 'base64'));
    console.log('Saved preview-portfolio.png');

    // Capture Full Page
    const fullPageShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync('preview-fullpage.png', Buffer.from(fullPageShot.data, 'base64'));
    console.log('Saved preview-fullpage.png');
  });

  // Tablet View
  await runSession(async (send) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:3000/#why-us' });
    await new Promise(r => setTimeout(r, 2000));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-tablet-why-us.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved preview-tablet-why-us.png');

    await send('Runtime.evaluate', {
      expression: `document.getElementById('portfolio-grid').scrollIntoView({ behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 1000));
    const portShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-tablet-portfolio.png', Buffer.from(portShot.data, 'base64'));
    console.log('Saved preview-tablet-portfolio.png');
  });

  // Mobile View
  await runSession(async (send) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:3000/#why-us' });
    await new Promise(r => setTimeout(r, 2000));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-mobile-why-us.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved preview-mobile-why-us.png');

    await send('Runtime.evaluate', {
      expression: `document.getElementById('portfolio-grid').scrollIntoView({ behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 1000));
    const portShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('preview-mobile-portfolio.png', Buffer.from(portShot.data, 'base64'));
    console.log('Saved preview-mobile-portfolio.png');
  });

  console.log('All screenshots captured!');
}

captureAll().catch(console.error);
