import { SessionData } from "../../models/SessionData";
import { TorrenteConsole } from "../Console";
import { TorrenteInterface } from "../TorrenteInterface"

export class LogoutCommand {
    public static activate = () => {
        const tInterface = TorrenteInterface.getInstance();
        tInterface.logout();
        const sessionData = SessionData.getInstance();
        sessionData.flushIdentity();
        const tConsole = TorrenteConsole.getInstance();
        tConsole.sucess('Logged off from authenticated session');
    }
}