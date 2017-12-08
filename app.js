var http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    js2xmlparser = require('js2xmlparser'),
    libxslt = require('libxslt'),
    ejs=require("ejs"),
    geocoder=require("google-geocoder");
    xml2js=require("xml2js");

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  fs.readFile(filepath, 'utf8', function(err, xmlStr) {
    if (err) throw (err);
    xml2js.parseString(xmlStr, {}, cb);
  });
}

//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
 var filepath = path.normalize(path.join(__dirname, filename));
  var builder = new xml2js.Builder();
   var xml = builder.buildObject(obj);
  fs.writeFile(filepath, xml, cb);
}

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

// GET request to dislay index.html located inside /views folder
router.get('/', function(req, res) {
  res.render('index');
});

// HTML produced by XSL Transformation
router.get('/get/html', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  var docSource = fs.readFileSync('Teams.xml', 'utf8');
   var stylesheetSource = fs.readFileSync('Teams.xsl', 'utf8');
    var doc = libxslt.libxmljs.parseXml(docSource);
     var stylesheet = libxslt.parse(stylesheetSource);
    var result = stylesheet.apply(doc);
   res.end(result.toString());
});

// POST request to add to JSON & XML files
router.post('/post/json', function(req, res) {
 // Function to read in a JSON file, add to it & convert to XML
  function prependJSON(obj) {
   geo.find(obj.Team,function(err, response){
    // Read in a JSON file
     var JSONfile = fs.readFileSync('Teams.json', 'utf8');
      // Parse the JSON file in order to be able to edit it 
       var JSONparsed = JSON.parse(JSONfile);
        // Add a new record into team array within the JSON file
         obj.coordinates = response;
          JSONparsed.myTeams.team.unshift(obj);
           // Beautify the resulting JSON file
           var JSONformated = JSON.stringify(JSONparsed, null, 4);
            // Write the updated JSON file back to the system 
            fs.writeFileSync('Teams.json', JSONformated);
              var JSONformated2 = JSON.stringify(JSONparsed.myTeams, null, 4);
             // Convert the updated JSON file to XML     
            var XMLformated = js2xmlparser.parse("myTeams", JSON.parse(JSONformated2));
           // Write the resulting XML back to the system
          fs.writeFileSync('Teams.xml', XMLformated);
       res.redirect('back');
    })
  }

  // Call appendJSON function and pass in body of the current POST request
  prependJSON(req.body);
 
});

// POST request to add to JSON & XML files
router.post('/post/delete', function(req, res) {
 // Function to read in a JSON file, add to it & convert to XML
  function deleteJSON(obj) {
   // Function to read in XML file, convert it to JSON, add a new object and write back to XML file
    xmlFileToJs('Teams.xml', function(err, result) {
     if (err) throw (err);
       result.myTeams.team.splice(obj.row-1,1);
        console.log(result);
         jsToXmlFile('Teams.xml', result, function(err) {
          if (err) console.log(err);
           })
          var string = JSON.stringify(result, null, 4);
         fs.writeFile('Teams.json', string, function(err) {
        if (err) console.log(err);
      })
    })
  }

  // Call appendJSON function and pass in body of the current POST request
  deleteJSON(req.body);
  res.redirect('back');

});
/*//xml, xsd validator
var x = require('libxmljs');
router.get('/Test', function(req,res){
 var xsd = fs.readFileSync('Teams.xsd', 'utf8')
  var xsdDoc = x.parseXmlString(xsd.toString());
   var xml0 = fs.readFileSync('Teams.xml','utf8')
    var xmlDoc0 = x.parseXmlString(xml0);
     var result0 = xmlDoc0.validate(xsdDoc);
    console.log("result0:", result0);
   res.end(result0.toString());
 })*/

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});