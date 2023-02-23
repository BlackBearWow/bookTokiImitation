//const firstCrawling = require('./firstCrawling');
//const secondCrawling = require('./secondCrawling');
const thirdCrawling = require('./thirdCrawling');
//크롤링 하는것.
/**
 * firstCrawling후 10초 기다리기, secondCrawling후 10초 기다리기, thirdCrawling후 60초 기다리기 무한반복 하자.
 */

async function crawlingJob(){
    while(true) {
        console.log("...");
        await sleep(1000);
        await thirdCrawling.thirdCrawling();
    }
}

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

//crawlingJob();

module.exports = {crawlingJob}