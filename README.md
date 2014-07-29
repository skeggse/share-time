share-time
==========

[![Build Status](https://travis-ci.org/skeggse/share-time.png)](https://travis-ci.org/skeggse/time-share)

Share time while processing an array by intermittently yielding to the event loop while iterating through the array.

Install
=======

```sh
$ npm install share-time
```

Usage
=====

```js
var share = require('share-time');
var crypto = require('crypto');

var key = new Buffer('d96fcd19bbb16757', 'hex');

var emails = [
  '6ec7a50e28794c0818aa009d3c0a31ecb096f5476425491db7290ef3a0def5d3',
  'af1f5a19b32afbf1809a7c6841418c504484c6a001db11281757d21f804f0519',
  '01d665907cfa8c3409d88f991510c8cc621987529d1a9531f85a0c161551c226',
  '2b018517917499fb8bb6c89955de22fb84836dba87758abf22aad6b39d43035e',
  // and many more
];

// decrypt at least 50ms worth of emails before deferring, repeat until complete
share(emails, 50, function(encrypted, index) {
  var decipher = crypto.createDecipher('aes128', key);
  var email = decipher.update(encrypted, 'hex', 'utf-8') + decipher.final('utf-8');
  emails[index] = email;
}, function() {
  emails.forEach(function(email) {
    console.log('email', email);
  });
});
```

Unlicense / Public Domain
=========================

> This is free and unencumbered software released into the public domain.

> Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

> In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

> For more information, please refer to <http://unlicense.org/>
