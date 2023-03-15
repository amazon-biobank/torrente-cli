import { writeFileSync } from "fs";
import { FileEncryptor } from "../../cryptography/FileEncryptor";
import { TorrenteConsole } from "../Console"

export class EncryptCommand{
    private static filepath: string;

    public static activate = async () => {
        const torrenteConsole = TorrenteConsole.getInstance();
        const encryptionPrompt = 'Encryption: type the file to encrypt \n';
        const filepath = await torrenteConsole.ask(encryptionPrompt);
        EncryptCommand.filepath = filepath;
        
        const fileEncryptor = FileEncryptor.getInstance();
        const encryptionResult = fileEncryptor.encrypt(EncryptCommand.filepath);

        const encryptionPath = `${EncryptCommand.filepath}.encrypted`;
        writeFileSync(encryptionPath, encryptionResult[0]);
        const keyPath = `${encryptionPath}.biobank`;
        const keyData = JSON.stringify({
            "secret_key": encryptionResult[1].toUpperCase()
        })
        writeFileSync(keyPath, keyData);
    }
}
