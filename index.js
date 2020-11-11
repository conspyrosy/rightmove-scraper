const puppeteer = require('puppeteer');
const config = require('./config.json');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(`https://www.rightmove.co.uk/property-for-sale/search.html?searchLocation=${config.searchPostcode}&locationIdentifier=&useLocationIdentifier=false&buy=For+sale`);

    const fields = {
        select: [
            'radius',
            'displayPropertyType',
            'minPrice',
            'maxPrice',
            'minBedrooms',
            'maxBedrooms',
            'maxDaysSinceAdded'
        ]
    }

    const getSelectableElementValues = (field) => {
        return page.evaluate((field) => {
            return Array.from(document.getElementById(field), e => ({
                option: e.innerText,
                optionValue: e.value,
            }))
        }, field);
    }

    const setRadius = () => {
        page.select('#radius', '40.0')
    }

    const submitForm = async () => {
        console.log("Submitting form...");
        await page.click('#submit');
    }

    await Promise.all(fields.select.map(field => getSelectableElementValues(field))).then(
        results => {
            console.log(results);
        }
    ).then(
        async () => {
            await setRadius();
            await submitForm();
            browser.close().then(() => console.log("Completed successfully."));
        }
    );
})();