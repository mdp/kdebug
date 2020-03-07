const execSync = require("child_process").execSync;
const bitcoin = require("bitcoinjs-lib")
const gibberish = require("./gibberish-aes.js")
const gibberishOld = require("./gibberish-aes.2013.04.15.js")

console.log(gibberishOld)

const TIMES=1000

function randPassword(len) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghipqrstuvwxyz";
  var randomstring = '';
  for (var i=0; i<len; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring
}

function openSSLDec(enc, pass) {
  var buf = execSync(`echo "${enc}" | openssl enc -d -aes-256-cbc -a -k ${pass} -md md5`)
  return buf.toString();
}

for (var i=0; i<TIMES; i++) {
  var keyPair = bitcoin.ECPair.makeRandom();
  var privateKey = keyPair.toWIF();

  var password = randPassword(20)
  var enc = gibberishOld.enc(privateKey, password)
  var decOssl = null;
  try {
    decOssl = openSSLDec(enc, password)
  } catch (e) {
    console.log("OpenSSL decryption error")
    console.log("Password:", password)
    console.log("Private WIP:", privateKey)
    console.log("Encoded:", enc)
    console.log("Dec", dec)
    throw("Failed")
  }
  var dec = gibberishOld.dec(enc, password)
  if (dec !== privateKey) {
    console.log("Gibberish decryption error")
    console.log("Password:", password)
    console.log("Private WIP:", privateKey)
    console.log("Encoded:", enc)
    console.log("Dec", dec)
    throw("Failed")
  }
}

console.log("Done")

