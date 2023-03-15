import { writeFileSync } from "fs";
import { FileEncryptor } from "../../cryptography/FileEncryptor";
import { TorrenteConsole } from "../Console"

export class DecryptCommand{
    private static filepath: string;
    private static keyFilePath: string;

    public static activate = async () => {
        const torrenteConsole = TorrenteConsole.getInstance();
        const decryptionPrompt = 'Decrypt: type the file to decrypt \n';
        const filepath = await torrenteConsole.ask(decryptionPrompt);
        DecryptCommand.filepath = filepath;
        
        const keyPrompt = 'Decrypt: type the file containing the key file \n';
        const keyFilePath = await torrenteConsole.ask(keyPrompt);
        DecryptCommand.keyFilePath = keyFilePath;

        const fileDecryptor = FileEncryptor.getInstance();

        const decryptionResult = fileDecryptor.decrypt(
            DecryptCommand.filepath, DecryptCommand.keyFilePath);

        const decryptionFilePath = `${DecryptCommand.filepath}.decrypted`
        writeFileSync(decryptionFilePath, decryptionResult);
    }
}
