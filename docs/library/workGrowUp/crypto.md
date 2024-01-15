# crypto 可逆加密

> 平时我们在传输数据的过程中，为了防止数据泄漏，会做一些加密传输的事情，可是在接收方我们又需要解密出来正常阅读，这个时候就用到了可逆加密的方式，简单给一下 crypto 的使用方法

```js
import CryptoJS from ‘crypto-js’;

let key = '8c72a371-2cb3-4289-9d6c-a5ccfa48e51a';

// DES CBC模式加密（ecb模式加密不需要偏移量iv）
export function encryptByDES(message) {
  // 把私钥转换成16进制的字符串
  let keyHex = CryptoJS.enc.Utf8.parse(key);
  
  // 模式为CBC padding为Pkcs7
  let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    iv: keyHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  // 加密出来是一个16进制的字符串
  return encrypted.ciphertext.toString();
}

// DES CBC模式解密(ecb模式解密不需要偏移量iv)
export function decryptByDESModeEBC(ciphertext) {
  // 把私钥转换成16进制的字符串
  let keyHex = CryptoJS.enc.Utf8.parse(key);
  
  // 把需要解密的数据从16进制字符串转换成字符byte数组
  let decrypted = CryptoJS.DES.decrypt(
    {
  		ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
  	},
    keyHex,
    {
      iv: keyHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  
  // 以utf-8的形式输出解密过后内容
  let result_value = decrypted.toString(CryptoJS.enc.Utf8);
  return result_value;
}
```
