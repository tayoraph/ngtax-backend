
import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js'; 

@Injectable()
export class EncryptionService {
     private envIv = CryptoJS.enc.Utf8.parse("UYtesg@(*7@#!LO_+!`(&");

     private passphrase = 'WQpot%#$ggHHjYRvH!@&*9:.<?~AQWJKGfsdkdMN/}{()876$#%@^UY!^5_+<0&b';
    private salt = CryptoJS.enc.Utf8.parse('elelohim@1)!@aAd');

    private envkey = CryptoJS.PBKDF2(this.passphrase, this.salt, {
      keySize: 256 / 32, // = 8 words = 32 bytes
      iterations: 1000
    });

    constructor() {}

       // encrypt env file 
     // Methods for the encrypt and decrypt Using AES
     envEnc(text:any): any {
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.envkey, {
         
            iv: this.envIv,
            mode: CryptoJS.mode.CBC,
           padding: CryptoJS.pad.Pkcs7
        });
        return  encrypted.toString();
    }
    // decrypt env 
    envDecrpt(decString:string) {
        var decrypted = CryptoJS.AES.decrypt(decString, this.envkey, {
            iv: this.envIv,
            mode: CryptoJS.mode.CBC,
           padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
