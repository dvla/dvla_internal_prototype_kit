var express = require('express');
var nunjucks = require('nunjucks');
var routes = require('./app/routes.js')
var path = require('path');
var app = express();
var port = (process.env.PORT || 3000);

nunjucks.configure('app/views', {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true
});

// Set views engine
app.set('view engine', 'html')

app.use('/public', express.static(path.join(__dirname, '/public')))

// routes (found in app/routes.js)
if (typeof (routes) !== 'function') {
    console.log(routes.bind)
    console.log('Warning: the use of bind in routes is deprecated - please check the prototype kit documentation for writing routes.')
    routes.bind(app)
} else {
    app.use('/', routes)
}

// Strip .html and .htm if provided
app.get(/\.html?$/i, function (req, res) {
    var path = req.path
    var parts = path.split('.')
    parts.pop()
    path = parts.join('.')
    res.redirect(path)
});

// Auto render any view that exists
// App folder routes get priority
app.get(/^\/([^.]+)$/, function (req, res) {
    var path = (req.params[0])
    res.render(path, function (err, html) {
        if (err) {
            res.render(path + '/index', function (err2, html) {
                if (err2) {
                    res.status(404).send(err + '<br>' + err2)
                } else {
                    res.end(html)
                }
            })
        } else {
            res.end(html)
        }
    })
});


app.listen(3000, () => {
    console.log('Listening on port', port);
});  
