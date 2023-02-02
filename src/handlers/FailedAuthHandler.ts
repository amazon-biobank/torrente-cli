import { TorrenteConsole } from "../view/Console";

export class FailedAuthHandler {
    public static handle = () => {
        const tConsole = TorrenteConsole.getInstance();
        tConsole.error('Incorrect password or invalid certificate');
    }
}