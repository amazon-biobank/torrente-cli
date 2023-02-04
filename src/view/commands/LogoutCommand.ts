import { SessionData } from "../../models/SessionData";
import { TorrenteConsole } from "../Console";
import { TorrenteInterface } from "../TorrenteInterface"

export class LogoutCommand {
    public static activate = () => {
        const sessionData = SessionData.getInstance();
        if (sessionData.getIsAuthenticated())
        {
            const tInterface = TorrenteInterface.getInstance();
            tInterface.logout();
            sessionData.flushIdentity();
            const tConsole = TorrenteConsole.getInstance();
            tConsole.sucess('Logged off from authenticated session');
            return;
        }
        throw Error("You're not authenticated to log out");
    }
}