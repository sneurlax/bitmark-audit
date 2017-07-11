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
var chain_db = low('bitmark.json', { storage: require('lowdb/lib/storages/file-async') });
chain_db.defaults({ block: {} })
  .write();

var audit_db = low('audit.json', { storage: require('lowdb/lib/storages/file-async') });
audit_db.defaults({ audit: {} })
  .write();

var chain = chain_db.get('block').value();

for( height in chain ) {
  var blocks = Object.keys(chain[height]).length;

  if( blocks > 1 ) {
    for( i=0; i < blocks-1; i++ ) { // write all but the latest blocks (the latest block will be the 'most' valid one.)
      audit_db
        .set('audit.'+height, chain[height][Object.keys(chain[height])[i]])
        .write();
    }

    if( blocks == 2 ) {
      console.log('Height '+height+': ORPHAN DETECTED');
    } else {
      console.log('Height '+height+': ORPHANS DETECTED');
    }
  } else {
    if( chain_db.has('block.'+(height-1)).value() ) { // only false for first recorded block
      if( chain[height][Object.keys(chain[height])[blocks-1]]['previousblockhash'] == Object.keys(chain_db.get('block.'+(height-1)).value())[Object.keys(chain[height-1]).length-1] ) { // current block's previousblockhash equals the previous block's hash
        // console.log('Height '+height+': OK');
      } else {
        console.log('Height '+height+': FAILED CHECK (expected previousblockhash '+(chain[height][Object.keys(chain[height])[0]]['previousblockhash']).substr(0,6)+'..., found '(Object.keys(chain_db.get('block.'+(height-1)).value())[0]).substr(0,6)+'...)');
      }
    } else { // first recorded block; don't/can't check previous block hash
      // console.log('Height '+height+': OK');
    }
  }
}
