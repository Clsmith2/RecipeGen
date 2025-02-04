const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeSafeway(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

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
}

// Example usage
scrapeSafeway('https://www.safeway.com/shop/search-results.html?q=eggs');
