const axios = require("axios").default;
const cheerio = require('cheerio');
const DB = require("./DB");

const bookTokiNum = '219';
const url = "https://booktoki"+bookTokiNum+".com/novel?book=%EC%9D%BC%EB%B0%98%EC%86%8C%EC%84%A4&sst=as_view&sod=desc";
//일반소설을 인기순으로 정렬
const headers = {
    'Host': 'booktoki'+bookTokiNum+'.com',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Microsoft Edge";v="110"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.49',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Accept-Language': 'ko,en;q=0.9,en-US;q=0.8',
    // 'Accept-Encoding': 'gzip, deflate, br' //이 줄을 주석하지 않으면 글자가 깨진다.
    //혹시 쿠키도 있어야 하나?
}
//헤더를 조작하지 않으면 북토끼에서 240시간동안 벤을 한다. 아마도 host가 이상한 host라면 10일동안 벤을 하는 것 같다. User-Agent도 신경써야 하는 것 같다.
axios({
    method: "get", //post, get가능
    url: url, //url을 넣으면 된다.
    headers: headers
})
    .then(function (response) {
        //성공했을 때 함수
        //console.log(response.headers);
        //console.log(response.data);
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
                let novelName = el.attributes.find((value) => { return value.name == 'date-title'; }).value;
                //결과물(소설)의 이름
                let text = $(el).find('div > div > div > div > div').html();
                let linkNumber = text.match(/(?<=https:\/\/booktoki[0-9]+.com\/novel\/)[0-9]+(?=\?)/gi)[0];
                console.log(`소설이름: ${novelName}, 소설번호: ${linkNumber}`);
                /**결과물(소설)의 링크주소(숫자)
                href="https://booktoki218.com/novel/108774?sst=as_view&amp;sod=desc&amp;book=%EC%9D%BC%EB%B0%98%EC%86%8C%EC%84%A4"
                이런 식으로 결과가 나온다. 여기서 숫자만 추출한다.
                */
                insertPromise.push(DB.insertNovelPromise(novelName, linkNumber));
            })
            Promise.all(insertPromise)
            .then(()=>DB.endConnection());
        }
        //console.log(result[0].html());
    })
    .catch(function (error) {
        //실패했을 때 함수
        console.log(error);
    });