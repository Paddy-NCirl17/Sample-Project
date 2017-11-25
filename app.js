var http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    js2xmlparser = require('js2xmlparser'),
    libxslt = require('libxslt'),
    ejs=require("ejs"),
    geocoder=require("google-geocoder");

var router = express();
var server = http.createServer(router);
var geo = geocoder({
  key:"AIzaSyCOtY3B9nrFWLW699A8i6V5IJQ_TKwmgZo" 
});

router.set('view engine','ejs')
router.use(express.static(path.resolve(__dirname, 'views')));
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// GET request to dislay index.html located inside /views folder
router.get('/', function(req, res) {
  var json = fs.readFileSync('Teams.json','utf8');
  var jsonParsed = JSON.parse(json);
  
  res.render('index',jsonParsed);
});

// HTML produced by XSL Transformation
router.get('/get/html', function(req, res) {
  
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    var docSource = fs.readFileSync('Teams.xml', 'utf8');
    //console.log(docSource.toString());
    var stylesheetSource = fs.readFileSync('Teams.xsl', 'utf8');
    
    var doc = libxslt.libxmljs.parseXml(docSource);
    var stylesheet = libxslt.parse(stylesheetSource);
    
    var result = stylesheet.apply(doc);
   // console.log(result.toString());
    res.end(result.toString());
  
});
router.get('/json/get',function(req,res){
  res.writeHead(200, { 'Content-Type': 'application/json'});//reads json and results in JSON.stringfy
  var json = fs.readFileSync('Teams.json','utf8');
  var jsonParsed = JSON.parse(json);
  res.end(JSON.stringify(jsonParsed));
})

router.post('/json/delete',function(req,res){
  
 var docSource = fs.readFileSync('Teams.xml', 'utf8');//Open File 
 var jsonParsed = JSON.parse(json);//parse to json
  //loop through object to find record
  //splice record
  //stringify object
  //write to file
  
 
  
})

// POST request to add to JSON & XML files
router.post('/post/json', function(req, res) {

  // Function to read in a JSON file, add to it & convert to XML
  function prependJSON(obj) {
    
     geo.find(obj.Location,function(err, response){
       // Read in a JSON file
        var JSONfile = fs.readFileSync('Teams.json', 'utf8');

        // Parse the JSON file in order to be able to edit it 
        var JSONparsed = JSON.parse(JSONfile);

        // Add a new record into team array within the JSON file
        obj.coordinates = response;
        JSONparsed.team.unshift(obj);

        // Beautify the resulting JSON file
        var JSONformated = JSON.stringify(JSONparsed, null, 4);

        // Write the updated JSON file back to the system 
        fs.writeFileSync('Teams.json', JSONformated);

        // Convert the updated JSON file to XML     
        var XMLformated = js2xmlparser.parse("myTeams", JSON.parse(JSONformated));

        // Write the resulting XML back to the system
        fs.writeFileSync('Teams.xml', XMLformated);
          // Re-direct the browser back to the page, where the POST request came from
       res.redirect('/');
      
    })

    
   //my comment 
    
   
  }

  // Call appendJSON function and pass in body of the current POST request
  prependJSON(req.body);
  
  

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});