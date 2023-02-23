const firstCrawling = require('./firstCrawling');
const secondCrawling = require('./secondCrawling');
const thirdCrawling = require('./thirdCrawling');
//크롤링 하는것.
/**
 * firstCrawling후 5초 기다리기, secondCrawling후 5초 기다리기, thirdCrawling후 10초 기다리기 무한반복 하자.
 */

async function crawlingJob(){
    while(true) {
        console.log("\n-- 첫번째 크롤링 --");
        await firstCrawling.firstCrawling();
        await sleep(2000);
        console.log("\n-- 두번째 크롤링 --");
        await secondCrawling.secondCrawling();
        await sleep(5000);
        console.log("\n-- 세번째 크롤링 --");
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