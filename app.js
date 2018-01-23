const express = require('express');
const http = require('http');
const url = require('url');
const path = require('path');
const request = require('request');
 
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

  let options = {
    url: 'https://api.kraken.com/0/public/Ticker?pair=etheur'
  };
  request(options).pipe(res);

  // I WANT TO GET THE DATA from options and send to data variable so I can render it on index.ejs

  // const data = ?

  res.render('index', {
    title: 'ARB MATRIX',
    data: data
  });

});
 
server.listen(process.env.PORT || 8080, function listening() {
  console.log('Listening on %d', server.address().port);
});