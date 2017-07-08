# Bitmark Auditor <sub><sup><sub><sup>*bitmark-audit*</sup></sub></sup></sub>
An auditing suite for the Bitmark blockchain and mempool

### Setup
The Bitmark configuration file must be set to allow JSON-RPC connections.  By defualt, Bitmark (or bitmarkd) will look for a file name `bitmark.conf` in the bitmark data directory, but both the data directory and the configuration file path may be changed using the -datadir and -conf command-line arguments.

| Operating System | Default bitmark datadir                    | Typical path to configuration file                                |
|------------------|--------------------------------------------|------------------------------------------------------------------|
| Windows          | %APPDATA%\Bitmark\                         | C:\Users\username\AppData\Roaming\Bitmark\bitmark.conf           |
| Linux            | $HOME/.bitmark/                            | /home/username/.bitmark/bitmark.conf                             |
| Mac OSX          | $HOME/Library/Application Support/Bitmark/ | /Users/username/Library/Application Support/Bitmark/bitmark.conf |

Specifically, the `server` flag must be set to 1 and both `rpcuser` and `rpcpassword` should be set to long unique strings.  For example:

```
##
## bitmark.conf configuration file. Lines beginning with # are comments.
##

#
# JSON-RPC options (for controlling a running Bitmark/bitmarkd process)
#

# server=1 tells Bitmark-Qt and bitmarkd to accept JSON-RPC commands
server=1

# rpcuser and rpcpassword set the credentials necessary to access the JSON-RPC api.
rpcuser=Abscond
rpcpassword=You_Will_Get_Robbed_If_You_Use_This
```

### Usage

Two tools are included in this repository: **monitor** and **audit**.

`monitor.js` should be kept running in order to detect orphans, forks, wipeouts, and so on.  If it is not running during such an event it will have no way of detecting it in retrospect.

`audit.js` scans the database built by `monitor.js` and audits it for any anomalies like those mentioned above.

### Notes

Monitoring began on 2017/07/07 at block height 286441.  `bitmark.json.bootstrap` is a log file created up to height 287571.  I (sneurlax) will work on uploading a canonical version of `bitmark.json` somewhere accessible "soon."
