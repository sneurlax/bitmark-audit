var jsonAuth = require('./jsonAuth.js');
var bitcoin = require('./node_modules/bitcoin')

var client = new bitcoin.Client({
  host: 'localhost',
  port: 9266,
  user: jsonAuth.rpcuser,
  pass: jsonAuth.rpcpassword,
  timeout: 30000
});

client.getBalance('*', 6, function(err, balance, resHeaders) {
  if (err) return console.log(err);
  console.log('Balance:', balance);
});
