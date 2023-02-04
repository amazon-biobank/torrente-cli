import { IPaymentNotifyData } from "../models/notifications/PaymentNotification";
import { SessionData } from "../models/SessionData";
import { TorrentController } from "../torrent/TorrentController";
import { TorrenteConsole } from "../view/Console";

export class PaymentHandler {
    public static handle = (paymentData: IPaymentNotifyData) => {
        const tConsole = TorrenteConsole.getInstance();
        const tData = SessionData.getInstance();
        const tController = TorrentController.getInstance();
        const shouldUnchoke = tData.decrementDebt(paymentData.payerIp, paymentData.blocksPaid);
        if (shouldUnchoke){
            tController.unchokeWire(paymentData.payerIp, paymentData.magneticLink);
        }
    }
}
