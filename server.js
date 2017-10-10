var express = require('express'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
path = require('path'),
port = 8000,
app = express();

// Set up body-parser to parse form data
app.use(bodyParser.urlencoded({extended: true}));

// Set up database connection, Schema, model
mongoose.connect('mongodb://localhost/cat_dashboard');

var CatSchema = new mongoose.Schema({
    name: String,
    image: String,
    treat: String,
    }, {timestamps: true});

var Cat = mongoose.model('cats', CatSchema);

// Point server to views
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, "./public")));
// We're using ejs as our view engine
app.set('view engine', 'ejs');

// Here are our routes!
app.get('/', function(req, res){
    Cat.find({}, function(err, results){
        if(err) { 
            console.log(err);
        } else {
            res.render('index', {cats: results});
        }
    });
});

app.get('/cats/edit/:id', function(req, res){
// Logic to grab all quotes and pass into the rendered view
    Cat.find({_id: req.params.id}, function(err, cat){
        if(err) { 
            console.log(err); 
        } else {
            console.log(cat);
            res.render('edit', {cat: cat});
        }
    });
});

app.get('/cats/new', function(req, res){
    res.render('new');
});

app.get('/cats/:id', function(req, res){
    Cat.find({_id: req.params.id}, function(err, cat){
        if(err) { 
            console.log(err);
        } else {
            console.log(cat);
            res.render('show', {cat: cat});
        }
    });
});

app.post('/cats/new', function(req, res){
    Cat.create(req.body, function(err){
        if(err) { 
            console.log(err); 
        } else {
            res.redirect('/');
        }
    });
});

app.post('/cats/:id', function(req, res){
    Cat.update({_id: req.params.id}, req.body, function(err){
        if(err) { 
            console.log("Show error", err); 
        } else {
            res.redirect('/');
        }
    });
});

app.post('/cats/destroy/:id', function(req, res){
    Cat.remove({_id: req.params.id}, function(err){
        if(err) { 
            console.log("Remove error", err); 
        } else {
            res.redirect('/');
        }
    });
});
// END OF ROUTING...

app.listen(port, function() {
console.log("listening on port: ", port);
});

