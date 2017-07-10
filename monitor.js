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

// db
//   .set('block', {height: 'height2', hash: 'hash2', info: {}})
//   .write();

var startHeight = 286441; // Auditing began on 2017/07/07
var maxHeight = 287550; // Some 'high' block height that we know exists
var delay = 0;

var blockHeight = startHeight;
var monitor = function() {
  if( blockHeight <= maxHeight ) {
    rpcClient.getBlockHash(blockHeight, function(err, blockHash, resHeaders) {
      if (err) return console.log(err);

      rpcClient.getBlock(blockHash, function(err, blockInfo, resHeaders) {
        if (err) return console.log(err);

        blockObj = {}
        blockObj[blockInfo['hash']] = blockInfo;

        var heightFound = db.has(blockInfo['height']).value()
        var hashFound = db.has(blockInfo['height']+'.'+blockInfo['hash']).value()

        if( !heightFound && !hashFound ) {
          db
            .set(blockInfo['height'], blockObj)
            .write();
          console.log('Recorded block '+blockInfo['hash']+' at height '+blockInfo['height']);
        } else if( heightFound && !hashFound ) {
          console.log('Orphan detected at height '+blockInfo['height']);

          var newBlockInfo = db.get(blockInfo['height']).value();
          // oldBlockInfo[blockInfo['hash']] = blockObj;
          newBlockInfo[blockInfo['hash']] = blockInfo;

          db
            .set(blockInfo['height'], newBlockInfo, blockObj)
            .write();
          console.log('Recorded new block '+blockInfo['hash']+' at height '+blockInfo['height']);
        } else {
          console.log('Found block '+blockInfo['hash']+' at height '+blockInfo['height']);
        }
      });
    });

    blockHeight++;
  } else {
    if( delay == 0 || delay == 3000 ) {
      delay = 100; // flag to indicate that we are querying the max block height
      currentHeight = rpcClient.getBlockCount( function(err, result, resHeaders) {
        if( err ) return console.log(err);
        if( maxHeight < result ) {
          maxHeight = result;
          delay = 0;
        }
        return
      });
    }

    if( maxHeight != 287550 ) {
      delay = 3000;
    }
    console.log('Waiting for new block. Current height '+(blockHeight-1));
    // break;
  }
  setTimeout(monitor, delay);
}

monitor();
