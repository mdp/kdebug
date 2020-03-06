const bitcoin = require("bitcoinjs-lib");
const gibberish = require("./gibberish-aes.js");
const bs58 = require('bs58');


function incrementBase58(num) {
  return padLeft(convertBase(num.toString(10), 10, 58), 4, '1')
}

function padLeft(nr, n, str){
  return Array(n-String(nr).length+1).join(str||'0')+nr;
}

function convertBase(str, fromBase, toBase) {

  const DIGITS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

  const add = (x, y, base) => {
    let z = [];
    const n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
      const xi = i < x.length ? x[i] : 0;
      const yi = i < y.length ? y[i] : 0;
      const zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i++;
    }
    return z;
  }

  const multiplyByNumber = (num, x, base) => {
    if (num < 0) return null;
    if (num == 0) return [];

    let result = [];
    let power = x;
    while (true) {
      num & 1 && (result = add(result, power, base));
      num = num >> 1;
      if (num === 0) break;
      power = add(power, power, base);
    }

    return result;
  }

  const parseToDigitsArray = (str, base) => {
    const digits = str.split('');
    let arr = [];
    for (let i = digits.length - 1; i >= 0; i--) {
      const n = digits[i]
      arr.push(n);
    }
    return arr;
  }

  const digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  let outArray = [];
  let power = [1];
  for (let i = 0; i < digits.length; i++) {
    digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
    power = multiplyByNumber(fromBase, power, toBase);
  }

  let out = '';
  for (let i = outArray.length - 1; i >= 0; i--)
    out += DIGITS[outArray[i]];

  return out;
}


encrypted = "U2FsdGVkX19h0mBsmRka+BR2Qmtt4oiKHR8a9F/eLGfQkVj51h4xbjtEd9LZlkHKiRAnKpudE/z6qV/LZ1geXp60nDe4opZeAnVNStb5/nC="
password = "7suYPeg80PAtVWMT7TIg"

var dec = gibberish.dec(encrypted, password)
console.log("Partial Key:", dec)

console.log(dec.length)

if (dec.length !== 48) {
  console.log(`Missing too much of the key, expected 48, got ${dec.length}`)
  // Sorry, this will likley not work
  process.exit(1)
}


const SPACE = 11316497; // 58**4
const validKeys = [];
const breakOnSuccess = true
for (var x=0; x<SPACE; x=x+1) {
  if (x%10000 == 0)  {
    console.log("At attempt", x);
  }
  var keyPair = null
  try {
    var attempt = dec + incrementBase58(x);
    if (x%10000 == 0)  {
      console.log("At attempt", x, "- Trying: ", attempt);
    }
    keyPair = bitcoin.ECPair.fromWIF(attempt);
    console.log("Found Key!!!", attempt)
    validKeys.push(attempt)
    if (breakOnSuccess) { break }
  } catch (e) {
    //console.log(e)
  }
}

console.log("Valid Keys", validKeys);

console.log("Done")

