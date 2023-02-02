
import { IAuthenticationNotifyData } from "../models/notifications/AuthenticationNotification";
import { SessionData } from "../models/SessionData";
import { TorrenteConsole } from "../view/Console";

export class AuthenticationHandler {
    public static handle = (authData: IAuthenticationNotifyData) => {
        const tConsole = TorrenteConsole.getInstance();
        const sessionData = SessionData.getInstance();
        sessionData.setUserId(authData.certificate, authData.orgMSPID);
        tConsole.sucess(`Properly authenticated under ${authData.orgMSPID}`);
    }
}
