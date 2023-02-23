const fs = require('fs');
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
    for (let i = 0; i < novels.length; i++) {
        //if (i >= 1) continue;
        //일단 한 소설만 하자
        let contents = await DB.selectPromise(`select * from content where novel_id = (select novel_id from novel where novelName = '${novels[i].novelName}');`)
        // const count = 1; //한꺼번에 너무 많은 요청을 하면 서버에서 403에러를 보내버린다.
        //1개씩 보내도 거부당했다. 시간초를 두고 요청해야겠다.
        // for (let k = 0; k < Math.ceil(contents.length / count); k++) {
        //     let insertPromise = [];
        //     for (let j = 0; j < count; j++) {
        //         const index = k*count+j;
        //         if(index>=contents.length) break;
        //         insertPromise.push(contentCrawlingAndMakeFilePromise(novels[i].novelName, contents[index].contentName, contents[index].contentLinkNum));
        //     }
        //     await Promise.all(insertPromise)
        // }
        const millisecond = 0.5 * 1000;
        for(let j=0; j<contents.length; j++) {
            await contentCrawlingAndMakeFilePromise(novels[i].novelName, contents[j].contentName, contents[j].contentLinkNum);
        }
    }
    DB.endConnection();
}

function contentCrawlingAndMakeFilePromise(novelName, contentName, contentLinkNum) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(`contents/${novelName}/${contentName}.txt`)) {
            //링크에 접속하여 크롤링하고 다운받는 과정까지.
            axios({
                method: "get", //post, get가능
                url: Constants.contentUrl(contentLinkNum),
                headers: Constants.headers2 //header3 추가 요망
            }).then(function (response) {
                let $ = cheerio.load(response.data);
                let elements = $('#novel_content > div > p');
                elements.each((idx, el) => {
                    fs.writeFileSync(`contents/${novelName}/${contentName}.txt`, $(el).html() + "\n", { flag: 'a' });
                })
                console.log(`파일생성: contents/${novelName}/${contentName}.txt`);
                sleep(0.5 * 1000)
                .then(()=>{
                    resolve('make file success');
                })
            })
        }
        else {
            console.log(`contents/${novelName}/${contentName}.txt 가 이미 있습니다.`);
            resolve('file alreay exist');
        }
    });
}

function sleep(ms) {
    return new Promise((resolve, reject)=>{
        setTimeout(resolve,ms);
    })
}

run();