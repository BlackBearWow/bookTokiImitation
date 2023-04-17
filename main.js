const express = require('express');
const app = express();
const fs = require('fs');
const DB = require('./DB');
const crawling = require('./crawling');
//const ejs = require('ejs');
const port = 10101;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(port, function(){
    console.log(`listening on ${port}`);
});

app.get('/', function(req, res){
    DB.createCon();
    DB.getNovelNamesPromise()
    .then((novels)=>{
        //DB.endConnection();
        res.render('index', {novels});    
    })
})

app.get('/novel', function(req, res){
    const novelName = req.query.novelName;
    DB.createCon();
    DB.getContentNamesPromise(novelName)
    .then((contents)=>{
        //DB.endConnection();
        res.render('novel', {novelName, contents})
    })
})

app.get('/view', function(req, res){
    const novelName = req.query.novelName;
    const contentName = req.query.contentName;
    DB.createCon();
    DB.getContentOrderAndCountPromise(novelName, contentName)
    .then((data) => {
        if(fs.existsSync(`contents/${novelName}/${contentName}.txt`)) {
            const contents = fs.readFileSync(`contents/${novelName}/${contentName}.txt`, 'utf-8').split('\n');
            res.render('view', {novelName, contentName, contents, contentOrder : data.contentOrder, count: data.count})
        }
        else {
            const contents = [`contents/${novelName}/${contentName}.txt 파일이 존재하지 않습니다`]
            res.render('view', {novelName, contentName, contents, contentOrder : data.contentOrder, count: data.count})
        }
    })
})

app.get('/beforeView', function(req, res){
    const novelName = req.query.novelName;
    const contentOrder = Number(req.query.contentOrder) - 1;
    DB.createCon();
    DB.getContentNamePromise(novelName, contentOrder)
    .then((data) => {
        res.redirect(`/view?novelName=${novelName}&contentName=${data}`)
    })
})

app.get('/afterView', function(req, res){
    const novelName = req.query.novelName;
    const contentOrder = Number(req.query.contentOrder) + 1;
    DB.createCon();
    DB.getContentNamePromise(novelName, contentOrder)
    .then((data) => {
        res.redirect(`/view?novelName=${novelName}&contentName=${data}`)
    })
})

app.get('/test', function(req, res){
    res.send('test page');
})

//크롤링 작업
crawling.crawlingJob();