var express 	= require('express');
var app   		= express();
var http 		= require('http');
var server 		= http.createServer(app);

var port 		= process.env.PORT || 3000;

var bot=require('./bot');
app.post('/api/messages',bot.default());

server.listen(port);
console.log('ContentHolmes app running on port ' + port);