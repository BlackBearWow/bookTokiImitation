const axios = require("axios").default;
const cheerio = require('cheerio');
const DB = require("./DB");
const Constants = require("./crawlingConstants");

/**
 *novel Table에서 모든 novel을 읽어 들인 후 
 각 novel의 novel_id에 맞는 contentName, contentLinkNum을 읽어들인 후
 페이지에서 콘텐트를 크롤링하여 파일에 저장한다.
 */
 async function run() {
    DB.createCon();
    let novels = await DB.selectPromise('select * from novel;');
    for(let i=0; i<novels.length; i++) {
        if(i >= 1) continue;
        //일단 한 소설만 하자
        let contents = await DB.selectPromise(`select * from content where novel_id = (select novel_id from novel where novelName = '${novels[i].novelName}');`)
        console.log(contents);
    }
    DB.endConnection();    
}

run();