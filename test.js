var rpcAuth = require('./rpcAuth.js');
var bitcoin = require('./node_modules/bitcoin')

var rpcClient = new bitcoin.Client({
  host: 'localhost',
  port: 9266,
  user: rpcAuth.rpcuser,
  pass: rpcAuth.rpcpassword,
  timeout: 30000
});

var low = require('lowdb');
var db = low('bitmark.json', { storage: require('lowdb/lib/storages/file-async') });
db.defaults({ block: {} })
  .write();

var blocks = db.get('block').value();

for( height in blocks ) {

  if( Object.keys(blocks[height]).length > 1 ) {
    if( Object.keys(blocks[height]).length == 2 ) {
      console.log('Height '+height+': ORPHAN DETECTED');
    } else {
      console.log('Height '+height+': ORPHANS DETECTED');
    }
  } else {
    if( db.has('block.'+(height-1)).value() ) { // only false for first recorded block
      if( blocks[height][Object.keys(blocks[height])[Object.keys(blocks[height]).length-1]]['previousblockhash'] == Object.keys(db.get('block.'+(height-1)).value())[Object.keys(blocks[height-1]).length-1] ) { // current block's previousblockhash equals the previous block's hash
        // console.log('Height '+height+': OK');
      } else {
        console.log('Height '+height+': FAILED CHECK (expected previousblockhash '+(blocks[height][Object.keys(blocks[height])[0]]['previousblockhash']).substr(0,6)+'..., found '(Object.keys(db.get('block.'+(height-1)).value())[0]).substr(0,6)+'...)');
      }
    } else { // first recorded block; don't/can't check previous block hash
      // console.log('Height '+height+': OK');
    }
  }
}
