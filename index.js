const express = require('express');
const app = express();
const DB = require('./DB');
const fs = require('fs');
//const ejs = require('ejs');
const port = 8888;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(port, function(){
    console.log(`listening on ${port}`);
});

app.get('/', function(req, res){
    DB.createCon();
    DB.getNovelNamesPromise()
    .then((novels)=>{
        DB.endConnection();
        res.render('index', {novels});    
    })
})

app.get('/novel', function(req, res){
    const novelName = req.query.novelName;
    DB.createCon();
    DB.getContentNamesPromise(novelName)
    .then((contents)=>{
        DB.endConnection();
        res.render('novel', {novelName, contents})
    })
})

app.get('/view', function(req, res){
    const novelName = req.query.novelName;
    const contentName = req.query.contentName;
    if(fs.existsSync(`contents/${novelName}/${contentName}.txt`)) {
        const contents = fs.readFileSync(`contents/${novelName}/${contentName}.txt`, 'utf-8').split('\n');
        res.render('view', {novelName, contentName, contents})
    }
    else {
        res.send(`contents/${novelName}/${contentName}.txt 파일이 존재하지 않습니다`);
    }
})

app.get('/test', function(req, res){
    res.send('test page');
})