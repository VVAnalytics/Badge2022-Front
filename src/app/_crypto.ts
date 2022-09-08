import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'EncryptionDecryptionSample';

    plainText: string | undefined;
    encryptText: string | undefined;
    encPassword: string | undefined;
    decPassword: string | undefined;
    conversionEncryptOutput: string | undefined;
    conversionDecryptOutput: string | undefined;

    constructor() {
    }
    //method is used to encrypt and decrypt the text  
    convertText(conversion: string) {
        if (conversion == "encrypt") {
            this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText!.trim(), this.encPassword!.trim()).toString();
        }
        else {
            this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText!.trim(), this.decPassword!.trim()).toString(CryptoJS.enc.Utf8);

        }
    }
}  