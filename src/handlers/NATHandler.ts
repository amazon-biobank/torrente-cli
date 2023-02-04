import { INATNotifyData } from "../models/notifications/NATNotification";
import { TorrenteConsole } from "../view/Console";

export class NATHandler {
    public static handle = (NATData: INATNotifyData) => {
        const tConsole = TorrenteConsole.getInstance();
        tConsole.warn(NATData.message);
    }
}