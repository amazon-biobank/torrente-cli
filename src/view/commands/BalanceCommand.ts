import { SessionData } from "../../models/SessionData";
import { TorrenteInterface } from "../TorrenteInterface";

export class BalanceCommand {
    public static activate = () => {
        const userData = SessionData.getInstance();
        if (userData.getIsAuthenticated())
        {
            const tInterface = TorrenteInterface.getInstance();
            tInterface.refreshWallet();
            return;
        }
        throw Error("You're not authenticated to check your balance");
    }
}
