const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--window-size=1640,1200',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));

  try {
    const targets = await fetch('http://127.0.0.1:9229/json/list').then(r => r.json());
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

    await new Promise(r => {
      if (ws.readyState === 1) r();
      else ws.addEventListener('open', r, { once: true });
    });

    await send('Page.enable');
    await send('Page.navigate', { url: 'https://www.projectone.website/' });
    await new Promise(r => setTimeout(r, 4000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || s.innerHTML.slice(0, 100));
          return { scripts };
        })()
      `,
      returnByValue: true
    });

    console.log('Scripts:', evalRes.result.value);
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

main();
