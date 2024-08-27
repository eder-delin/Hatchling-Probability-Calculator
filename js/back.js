var https = require('https');
var err = false;
const cheerio = require('../plugin/node_modules/cheerio');
var urlPattern = /(https:\/\/)?www1.flightrising.com\/scrying\/predict\?age=[0-9]+&body=[0-9]+&bodygene=[0-9]+&breed=[0-9]+&element=[0-9]+&eyetype=[0-9]+&gender=[0-9]+&tert=[0-9]+&tertgene=[0-9]+&winggene=[0-9]+&wings=[0-9]+/;

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end(".test/index.html");
// }).listen(8080);

const options = {
  // host: 'www1.flightrising.com',
  host: "europe-west1-hatchling-probability.cloudfunctions.net",
  path: "/findbyid",
  // port: 443,
  // path: '/scrying/predict/111111111',
  // host: 'hatchling-probability.ew.r.appspot.com',
  method: 'GET'
}

const req = https.get(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    const $ = cheerio.load(d);
    console.log($.html());
    // console.log(d);
    // $(".common-message").each(function(){
    //   console.log("invalid id");
    //   err = true;
    //  });
    // if (err) return;
    // $("a").each(function(){
    //    if ($(this).attr("href").match(/element/g) != null){
    //      console.log($(this).attr("href"));
    //    }
    //  });
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()
