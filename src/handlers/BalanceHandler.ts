import { IWalletRefreshData } from "../models/notifications/WalletNotification";
import { TorrenteConsole } from "../view/Console";

export class BalanceHandler {
    public static handle = (balanceData: IWalletRefreshData) => {
        const tConsole = TorrenteConsole.getInstance();
        const wallet = balanceData.wallet;
        const structData = [
            { type: 'Available', amount: wallet.available },
            { type: 'Frozen', amount: wallet.frozen},
            { type: 'Redeemable', amount: wallet.redeemable}
        ]
        tConsole.sucess('Obtained wallet state:');
        tConsole.table(structData);
    }
}
