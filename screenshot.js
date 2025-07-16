const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ 
    width: 1080, 
    height: 1920,
    deviceScaleFactor: 1
  });
  
  try {
    await page.goto('http://localhost:5000', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    await page.screenshot({ 
      path: 'tablet-screenshot-10inch.png',
      fullPage: false 
    });
    
    console.log('Screenshot saved as tablet-screenshot-10inch.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  }
  
  await browser.close();
})();
