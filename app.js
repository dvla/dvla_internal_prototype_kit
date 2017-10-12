var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var app = express();
var port = (process.env.PORT || 3000);

nunjucks.configure('app/views', {
    autoescape: true,
    express: app
});


app.use('/public', express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    res.render('index.html');
})


app.listen(3000, () => {
    console.log('Listening on port', port);
});  
