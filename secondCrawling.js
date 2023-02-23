const axios = require("axios").default;
const cheerio = require('cheerio');
const DB = require("./DB");
const Constants = require("./crawlingConstants");

/**
 *novel Table에서 모든 novel을 읽어 들인 후 
 각 novel의 linkNum에 맞는 페이지에 접속
 페이지에서 화수들을 크롤링하여 DB에 저장한다.
 */
async function secondCrawling() {
    DB.createCon();
    let novels = await DB.selectPromise('select * from novel;');
    for(let i=0; i<novels.length; i++) {
        //if(i >= 2) continue;
        //일단 한 소설만 하자
        let response = await axios({
            method: "get", //post, get가능
            url: Constants.listUrl(novels[i].linkNum), //url을 넣으면 된다.
            headers: Constants.headers2
        })
        let $ = cheerio.load(response.data);
        let elements = $('#serial-move > div > ul > li');
        //let elements = $('ul.list-body > li');
        if(elements.length == 0) {
            console.log(`error: ${novels[i].novelName}을 크롤링하는데 읽히지 않습니다.`)
        }
        let insertPromise = [];
        elements.each((idx, el)=>{
            //if(idx > 10) return;
            //이것도 잘 되면 없애자.
            let contentOrder = $(el).find('div.wr-num').html();
            //몇번째 소설인지 번호이다. 1번부터 시작한다.
            let contentLinkNum = $(el).find('div.wr-subject > a').attr('href').match(/(?<=https:\/\/booktoki[0-9]+.com\/novel\/)[0-9]+(?=\?)/gi)[0];
            //소설 링크 숫자.
            let contentName = $(el).find('div.wr-subject > a').html().replaceAll("\n","").replaceAll(/<span(.*?)<\/span>/gi,"").trim().slice(0, 90).replaceAll(/[^가-힣0-9a-zA-Z ]/gi, '');
            //콘텐츠 이름. 특수문자는 운영체제에서 파일 이름으로 저장 안될 수 있으니 숫자 영어 한글만 가능하게 한다.
            //console.log(`novel_id: ${novels[i].novel_id}, contentOrder: ${contentOrder}, 링크번호: ${contentLinkNum}, 콘텐트이름: ${contentName}`);
            //이제 받아온 정보를 DB에 저장하자.
            insertPromise.push(DB.insertContentPromise(novels[i].novel_id, contentOrder, contentName, contentLinkNum));
        })
        await Promise.all(insertPromise)
        console.log(`리스트 다운: ${novels[i].novelName}`);
    }
    //DB.endConnection();    
}

module.exports = {secondCrawling}