const express = require('express');
const http = require('http');
const url = require('url');
const path = require('path');
const rp = require('request-promise');
const app = express();
 
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use((req, res, next) =>{
  res.locals.errors = null;
  next();
})


app.get('/', (req, res, next) => {

  const coin1 = {
    uri: 'https://api.kraken.com/0/public/Ticker',
    qs:{
      pair: 'etheur'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  const coin2 = {
    uri: 'https://api.bitso.com/v3/ticker',
    qs:{
      book: 'btc_mxn'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  const coin3 = {
    uri: 'https://www.mercadobitcoin.net/api/btc/ticker/',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  
  let data1, data2, data3 = '';
  rp(coin1)
    .then(function(resp){
      const json = resp.result;  
      for(key in json) {
        if(json.hasOwnProperty(key)) {
          var value = json[key];
          data1 = value.c;
        }
      }
    })    
    .then(function() {
      return rp(coin2); 
    })
    .then(function(resp) {
      const json = resp.payload;  
      data2 = json.last;
    })
    .then(function() {
      return rp(coin3); 
    })
    .then(function(resp) {
      const json = resp.ticker;  
      data3 = json.last;
    })
    .then(function(){
      res.render('index',{
        title: 'ARB MATRIX',
        data1,
        data2,
        data3
      });
    })
    .catch(function (err) {
      // Crawling failed or Cheerio choked...
      console.log(err)
    });;

    
});
 
server.listen(process.env.PORT || 8080, function listening() {
  console.log('Listening on %d', server.address().port);
});