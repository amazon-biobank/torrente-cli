import { TorrenteInterface } from "../TorrenteInterface";

export class BalanceCommand {
    public static activate = () => {
        const tInterface = TorrenteInterface.getInstance();
        tInterface.refreshWallet();
    }
}
