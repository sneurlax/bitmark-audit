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

var startHeight = 286441; // Auditing began on 2017/07/07
var maxHeight = 289590; // Some 'high' block height that we know exists
var delay = 0;
var notificationCount = 0; // Use to check if we've already printed notification plus store times since printed.

var blockHeight = startHeight;
var monitor = function() {
  if( blockHeight <= maxHeight ) {
    rpcClient.getBlockHash(blockHeight, function(err, blockHash, resHeaders) {
      if (err) return console.log(err);

      rpcClient.getBlock(blockHash, function(err, blockInfo, resHeaders) {
        if (err) return console.log(err);

        blockObj = {}
        blockObj[blockInfo['hash']] = blockInfo;

        var heightFound = db.has('block.'+blockInfo['height']).value()
        var hashFound = db.has('block.'+blockInfo['height']+'.'+blockInfo['hash']).value()

        notificationCount && console.log() // Make sure we get a new line after the stdout formating.
        if( !heightFound && !hashFound ) {
          notificationCount = 0;
          db
            .set('block.'+blockInfo['height'], blockObj)
            .write();
          console.log('Recorded block '+blockInfo['hash']+' at height '+blockInfo['height']);
        } else if( heightFound && !hashFound ) {
          notificationCount = 0;
          console.log('Orphan detected at height '+blockInfo['height']);

          var newBlockObj = db.get(blockInfo['height']).value();
          newBlockObj[blockInfo['hash']] = blockInfo;

          db
            .set('block.'+blockInfo['height'], newBlockObj, blockObj)
            .write();
          console.log('Recorded new block '+blockInfo['hash']+' at height '+blockInfo['height']);
        } else {
          notificationCount = 0;
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
    if (notificationCount++ == 0) console.log('Waiting for new block. Current height '+(blockHeight-1))
    else {
      for(i=0, progressInDots =''; i<notificationCount; i++) progressInDots += '.'
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(progressInDots);
    }
    // break;
  }
  setTimeout(monitor, delay);
}

monitor();
