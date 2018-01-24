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
    get('https://api.kraken.com/0/public/Ticker?pair=etheur'), //1
    get('https://api.bitso.com/v3/ticker?book=btc_mxn'), //2
    get('https://www.mercadobitcoin.net/api/btc/ticker/'), //3
    get('https://www.bitstamp.net/api/ticker/'), //4
    get('https://webapi.coinfloor.co.uk:8090/bist/XBT/GBP/ticker/'), //5
    get('https://api.mybitx.com/api/1/ticker?pair=XBTZAR'), //6
    get('https://api.coinsecure.in/v1/exchange/ticker'),
    get('https://bx.in.th/api/')
  ]).then(([data1, data2, data3, data4, data5, data6, data7, data8]) => {
    const json =  data1.result;
    for(key in json) {
      if(json.hasOwnProperty(key)) {
        var value = json[key];
        data1 = value.c;
      }
    }
    // console.log(data8);
    res.render('index',{
      title: 'ARB MATRIX',
      coinKraken : data1,
      coinBitso: data2.payload.last,
      coinMercado: data3.ticker.last,
      coinBitstamp: data4.last,
      coinCoinfloor: data5.last,
      coinLuno: data6.last_trade,
      coinCoinsecure: data7.message.lastPrice
    });    
  });
  
});
 
server.listen(process.env.PORT || 8080, function listening() {
  console.log('Listening on %d', server.address().port);
});