import { readFileSync } from "fs";
import { IAuthenticationMessageData } from "../../models/messages/AuthenticationMessage";
import { TorrenteConsole } from "../Console";
import { TorrenteInterface } from "../TorrenteInterface";

export class AuthenticationCommand {
    private static filepath: string;

    public static activate = async () => {
        const torrenteConsole = TorrenteConsole.getInstance();
        const authenticationPrompt = 'Authentication: type in credentials file name\n> '
        const filepath = await torrenteConsole.ask(authenticationPrompt)
        AuthenticationCommand.filepath = filepath;
        const passwordPrompt = 'Authentication: type in password to decrypt credentials\n> '
        const password = await torrenteConsole.ask(passwordPrompt);

        const authMessage = AuthenticationCommand.mountAuthMessage(password);

        const torrenteInterface = TorrenteInterface.getInstance();
        torrenteInterface.authenticate(authMessage);
    }

    private static mountAuthMessage = (password: string): IAuthenticationMessageData => {
        try{
            const credentialsFile = readFileSync(AuthenticationCommand.filepath).toString();
            const credentialsJson = JSON.parse(credentialsFile);
            const credentials: IAuthenticationMessageData = {
                encrypted_content: credentialsJson['encrypted_content'],
                password: password,
                salt: credentialsJson['salt']
            }
            return credentials;
        }
        catch{
            throw Error(`No such file called ${AuthenticationCommand.filepath}`)
        }
    }

}