const firstCrawling = require('./firstCrawling');
const secondCrawling = require('./secondCrawling');
const thirdCrawling = require('./thirdCrawling');
//크롤링 하는것.
/**
 * firstCrawling후 10초 기다리기, secondCrawling후 10초 기다리기, thirdCrawling후 10초 기다리기 무한반복 하자.
 */

async function crawlingJob(){
    while(true) {
        console.log("...");
        await firstCrawling.firstCrawling();
        await sleep(10000);
        await secondCrawling.secondCrawling();
        await sleep(10000);
        await thirdCrawling.thirdCrawling();
        await sleep(10000);
    }
}

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

//crawlingJob();

module.exports = {crawlingJob}