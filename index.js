const express = require('express');
const app = express();
const ejs = require('ejs');
const port = 8888;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(port, function(){
    console.log(`listening on ${port}`);
});

app.get('/', function(req, res){
    const title = "이게 타이틀 입니다.";
    res.render('index', {title, count:5});
})

app.get('/novel', function(req, res){
    res.send('novel page');
})

app.get('/view', function(req, res){
    res.send('view page');
})