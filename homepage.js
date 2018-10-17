var express = require('express');
var fortune = require("./fortune");

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
        res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
        next();
});

app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/newsletter', function(req, res){
res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.get('/newsletter-ajax', function(req, res){
res.render('newsletter-ajax', { csrf: 'CSRF token goes here' });
});

app.post('/process', function(req,res){
  if(req.xhr || req.accepts('json,html')==='json'){
  // if there were an error, we would send {error: 'error description' }
  console.log(JSON.stringify(req.body));
  res.send({
  success: true,
  message: "The submission was successful!"
 });
} else {
  // if there were an error, we would redirect to an error page
  res.redirect(303, '/thank-you');
  }
});

app.post('/process', function(req, res){
console.log('Form (from querystring): ' + req.query.form);
console.log('CSRF token (from hidden form field): ' + req.body._csrf);
console.log('Name (from visible form field): ' + req.body.name);
console.log('Email (from visible form field): ' + req.body.email);
res.redirect(303, '/thank-you');
});


app.use(function(req, res, next){
  if(!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weatherContext = {
   locations: [
  {
                name: 'Portland',
                forecastUrl: 'http://www.forecast.com/portland',
                iconUrl: 'http://www.icon.com/icon',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
},
{
                name:'Bend',
                forecastUrl: 'http://www.forceast.com/bend',
                iconUrl: 'http://www.icon.com/icon',
                weather: 'Partly Cloudy',
                temp: '54.1 F (12.3 C)',
},
{
                name:'Manzanita',
                forecastUrl: 'http://www.forceast.com/Manzanita',
                iconUrl: 'http://www.icon.com/icon',
                weather: 'Light Rain',
                temp: '54.1 F (12.3 C)',
        },
],
};
next();
});


app.get('/schedule', function(req, res){
        res.render('schedule', {
                currency: {
                        name: 'Point Park University',
                        abbrev: 'USD',
                },
                courses: [
                        { name: 'Web Application Development'},
                        { name: 'Digital Security'},
                        { name: 'Public Administration'},
			{ name: 'Business Law 1'},
			{ name: 'Business Communications'},
			{ name: 'World Religions'},



                ],
                specialsUrl: '/january-specials',
                
        });
});


app.get('/tour-info', function(req, res){
        res.render('tour-info', {
                currency: {
                        name: 'United States dollars',
                        abbrev: 'USD',
                },
                tours: [
                        { name: 'Hood River', price: '$99.95', location: 'Whatever'},
                        { name: 'Oregon Coast', price: '$159.95', location: 'Oregon'},
                        { name: 'Pittsburgh', price: '$359.95', location: 'Pennsylvania' },
                ],
                specialsUrl: '/january-specials',
                currencies: 'USD'
        });
});

app.get('/headers', function(req, res){
res.set('Content-Type', 'text/plain');
var s = '';
for(var name in req.headers) s += name + ': ' + req.headers[name] + '/n';
res.send(s);
});


app.get('/tours/hood-river', function(req, res){
        res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
        res.render('tours/request-group-rate');
});


app.get('/', function(req, res) {
        res.render('home');
});
app.get('/about', function(req, res){ 
        res.render('about', {
	fortune: fortune.getFortune(),
	pageTestScript: '/qa/tests-about.js'
});
});
app.get('/datetime', function(req, res) {
        res.render('datetime');
});
//static pages
app.use(express.static(__dirname + '/public'));

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
        res.status(404);
        res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
});

//set up handlebars view engine
var handlebars = require('express-handlebars')
        .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
        res.type('text/plain');
        res.send('Meadowlark Travel');
});
app.get('/about', function(req, res){
        res.type('text/plain');
        res.send('About This Webpage');
});
// custom 404 page
app.use(function(req, res, next){
        res.type('text/plain');
        res.status(404);
        res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next){
        console.error(err.stack);
        res.type('text/plain');
        res.status(500);
        res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
console.log('Express started on http://localhost:' +
app.get('port') + '; pressCtrl-C to terminate.');
});

