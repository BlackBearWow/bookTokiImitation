const bookTokiNum = '219'

const Constants = {
    bookTokiNum,
    novelNameListUrl : "https://booktoki"+bookTokiNum+".com/novel?book=%EC%9D%BC%EB%B0%98%EC%86%8C%EC%84%A4&sst=as_view&sod=desc",
    //일반소설을 인기순으로 정렬
    listUrl : function(num) {return "https://booktoki219.com/novel/"+num;},
    contentUrl : function(num) {return "https://booktoki219.com/novel/"+num;},
    //화수를 보는 페이지와 내용을 보는 페이지 모두 num만 바꾸면 링크는 똑같다.
    headers : {
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
    },
    //헤더를 조작하지 않으면 북토끼에서 240시간동안 벤을 한다. 아마도 host가 이상한 host라면 10일동안 벤을 하는 것 같다. User-Agent도 신경써야 하는 것 같다.
    headers2 : {
        'Host': 'booktoki'+bookTokiNum+'.com',
        'Connection': 'keep-alive',
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
        'Referer': 'https://booktoki'+bookTokiNum+'.com/novel?sst=as_view&sod=desc',
        'Accept-Language': 'ko,en;q=0.9,en-US;q=0.8',
        // 'Accept-Encoding': 'gzip, deflate, br' //이 줄을 주석하지 않으면 글자가 깨진다.
        //혹시 쿠키도 있어야 하나?
    }
}

module.exports = Constants;