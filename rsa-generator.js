// 生成rsa秘钥
const NodeRSA = require('node-rsa');
const fs = require('fs-extra');

function generator() {
  const key = new NodeRSA({ b: 1024 });
  key.setOptions({ encryptionScheme: 'pkcs1' });

  const privatePem = key.exportKey('pkcs8-private');
  const publicPem = key.exportKey('pkcs8-public');

  fs.ensureDir('./src/pem', err => {
    console.log(err); // => null
    // dir has now been created, including the directory it is to be placed in
    fs.writeFile('./src/pem/public.pem', publicPem, (err) => {
      if (err) throw err;
      console.log('公钥已保存！');
    });
    fs.writeFile('./src/pem/private.pem', privatePem, (err) => {
      if (err) throw err;
      console.log('私钥已保存！');
    });
  });
}

generator();