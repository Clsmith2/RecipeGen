const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const proxies = [
    'http://47.90.205.231:33333',

];

async function getRandomProxy() {
    return proxies[Math.floor(Math.random() * proxies.length)];
}

async function scrapeSafeway(url) {
    let proxyServer;
    let browser;

    for (let i = 0; i < proxies.length; i++) {
        try {
            proxyServer = await getRandomProxy();
            console.log(`Trying proxy: ${proxyServer}`);

            browser = await puppeteer.launch({
                headless: false, // Run in headful mode for better scraping success
                args: [`--proxy-server=${proxyServer}`],
            });

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            // Add extra HTTP headers
            await page.setExtraHTTPHeaders({
                'Referer': 'https://www.safeway.com/',
            });

            // Increase timeout for slow-loading pages
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            const content = await page.content();
            const $ = cheerio.load(content);

            // Extract product names and cleaned prices
            const products = $('.product-card-container__details').map((i, element) => {
                const productName = $(element).closest('.product-card-container').find('.product-title__name').text().trim();
                let productPrice = $(element).find('[data-qa=prd-itm-prc]').text().trim();

                // Remove "Your Price" and additional unwanted text
                productPrice = productPrice.replace('Your Price', '').trim();

                return { name: productName, price: productPrice };
            }).get();

            console.log(products);

            await browser.close();
            break; // Exit loop if successful
        } catch (error) {
            console.error(`Failed with proxy ${proxyServer}: ${error.message}`);
            if (browser) await browser.close(); // Ensure browser is closed before retrying
        }
    }
}

// Example usage
scrapeSafeway('https://www.safeway.com/shop/search-results.html?q=eggs');