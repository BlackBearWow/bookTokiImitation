const fs = require('fs');
const axios = require("axios").default;
const cheerio = require('cheerio');
const DB = require("./DB");
const Constants = require("./crawlingConstants");

function mkdir(dirPath) {
    if(!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true});
    }
}

async function firstCrawling() {
    let response = await axios({
        method: "get", //post, get가능
        url: Constants.novelNameListUrl, //url을 넣으면 된다.
        headers: Constants.headers
    })
}
axios({
    method: "get", //post, get가능
    url: Constants.novelNameListUrl, //url을 넣으면 된다.
    headers: Constants.headers
})
    .then(function (response) {
        //성공했을 때 함수
        const data = response.data;
        let $ = cheerio.load(data);
        let results = $('#webtoon-list-all > li');
        //결과물의 리스트를 받아옴
        console.log('읽어온 소설 개수:'+results.length);
        let maxCount = Math.min(10, results.length);
        //최대 10개까지의 정보를 받을 예정
        let insertPromise = [];
        //소설을 DB에 insert할 promise들을 담을 배열이다. 아래 Promise.all을 사용하여 insert되기 전에 DB가 end하는 것을 방지한다.
        if (maxCount > 0) {
            DB.createCon();
            results.each((idx, el) => {
                //cheerio는 each라는 메소드로 여러 element들을 순환할 수 있게 지원한다.
                if (idx >= maxCount) return;
                let novelName = $(el).attr('date-title').slice(0, 90);
                //결과물(소설)의 이름. DB에 저장이 무리가지 않게 글자수를 제한둔다.
                let text = $(el).find('div > div > div > div > div').html();
                let linkNumber = text.match(/(?<=https:\/\/booktoki[0-9]+.com\/novel\/)[0-9]+(?=\?)/gi)[0];
                console.log(`소설이름: ${novelName}, 소설번호: ${linkNumber}`);
                /**결과물(소설)의 링크주소(숫자)
                href="https://booktoki218.com/novel/108774?sst=as_view&amp;sod=desc&amp;book=%EC%9D%BC%EB%B0%98%EC%86%8C%EC%84%A4"
                이런 식으로 결과가 나온다. 여기서 숫자만 추출한다.
                */
                insertPromise.push(DB.insertNovelPromise(novelName, linkNumber));
                //디렉토리를 생성한다.
                mkdir(`contents/${novelName}`);
            })
            Promise.all(insertPromise)
            .then(()=>DB.endConnection());
        }
    })
    .catch(function (error) {
        //실패했을 때 함수
        console.log(error);
    });