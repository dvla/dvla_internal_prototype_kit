var express = require('express');
var nunjucks = require('nunjucks');
var routes = require('./app/routes.js')
var path = require('path');
var app = express();
var port = (process.env.PORT || 4444);

// The following line "app.use(..." is what you want to add to your project
// Make sure the browser-require middleware comes before staticProvider middleware
// app.use(exposeRequire({
//     base: __dirname   // This is where we look to find your non-global modules
// }));

var appViews = [
    path.join(__dirname, '/app/views'),
    path.join(__dirname, '/app/macros'),
    path.join(__dirname, '/node_modules/dvla-internal-frontend-toolkit/app/views'),
    path.join(__dirname, '/node_modules/dvla-internal-frontend-toolkit/app/views/layouts/nunjucks'),
]

nunjucks.configure(appViews, {
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


app.listen(port, () => {
    console.log('Listening on port ' + port + '   url: http://localhost:' + port);
});  
