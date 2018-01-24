const express = require('express');
const http = require('http');
const url = require('url');
const path = require('path');
const app = express();
const fetch = require('node-fetch');
 
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use((req, res, next) =>{
  res.locals.errors = null;
  next();
})


function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

app.get('/', (req, res, next) => {
  
  Promise.all([
    get('https://api.kraken.com/0/public/Ticker?pair=etheur'),
    get('https://api.bitso.com/v3/ticker?book=btc_mxn'),
    get('https://www.mercadobitcoin.net/api/btc/ticker/')
  ]).then(([data1, data2, data3]) => {
    const json =  data1.result;
    for(key in json) {
      if(json.hasOwnProperty(key)) {
        var value = json[key];
        data1 = value.c;
      }
    }
    res.render('index',{
      title: 'ARB MATRIX',
      data1,
      data2: data2.payload.last,
      data3: data3.ticker.last
    });    
  });
  
});
 
server.listen(process.env.PORT || 8080, function listening() {
  console.log('Listening on %d', server.address().port);
});