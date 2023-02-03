import { SessionData } from "../../models/SessionData";
import { TorrenteInterface } from "../TorrenteInterface";

export class RedeemCommand {
    public static activate = () => {
        const userData = SessionData.getInstance();
        if (userData.getIsAuthenticated())
        {
            const tInterface = TorrenteInterface.getInstance();
            tInterface.redeem();
            return;
        }
        throw Error("You're not authenticated to redeem tokens");
    }
}
