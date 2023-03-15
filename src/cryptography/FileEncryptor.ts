import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { hexToBytes } from './HexConverter';

export class FileEncryptor {
    private static instance: FileEncryptor;
    private static KEY_SIZE: number = 32;

    public constructor() {

    }

    public static getInstance = (): FileEncryptor => {
        if (!FileEncryptor.instance)
            FileEncryptor.instance = new FileEncryptor();
        return FileEncryptor.instance;
    }

    public encrypt = (filepath: string): [Buffer, string] => {
        const keyBytes = randomBytes(FileEncryptor.KEY_SIZE);
        const iv = keyBytes.slice(0, FileEncryptor.KEY_SIZE / 2);
        const key = keyBytes.slice(FileEncryptor.KEY_SIZE / 2, FileEncryptor.KEY_SIZE);
        const cipher = createCipheriv('aes-128-gcm', key, iv);

        const fileToEncrypt = readFileSync(filepath).toString();

        const res = Buffer.concat([cipher.update(fileToEncrypt), cipher.final(), cipher.getAuthTag()]);

        return [res, keyBytes.toString('hex')];
    }

    public decrypt = (filepath: string, keyPath: string) => {
        const keyFile = readFileSync(keyPath).toString();
        const keyJson = JSON.parse(keyFile);

        const keyString: string = keyJson['secret_key'];
        const keyBytes = hexToBytes(keyString);
        const iv = keyBytes.slice(0, FileEncryptor.KEY_SIZE / 2);
        const key = keyBytes.slice(FileEncryptor.KEY_SIZE / 2, FileEncryptor.KEY_SIZE);
        const decipher = createDecipheriv('aes-128-gcm', key, iv);
        
        const fileToDecrypt = readFileSync(filepath);
        const tag = fileToDecrypt.slice(fileToDecrypt.length - 16, fileToDecrypt.length);
        const toDecrypt = fileToDecrypt.slice(0, fileToDecrypt.length - tag.length);
        decipher.setAuthTag(tag);

        const res = Buffer.concat([decipher.update(toDecrypt), decipher.final()]);

        return res; 
    }
}
