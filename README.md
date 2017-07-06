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
