import { IConnectionNotifyData } from "../models/notifications/ConnectionNotification";
import { TorrenteConsole } from "../view/Console";

export class PayfluxoConnectionHandler {
    public static handle = (connData: IConnectionNotifyData) => {
        const tConsole = TorrenteConsole.getInstance();
        switch(connData.status){
            case 'connected':
                tConsole.sucess("Connected to Payfluxo");
                tConsole.enableCommands();
                break;
            default:
                tConsole.error(connData.status)
                break;
        }
    }
}