import { AuthenticationHandler } from "../../handlers/AuthenticationHandler";
import { FailedAuthHandler } from "../../handlers/FailedAuthHandler";
import { NATHandler } from "../../handlers/NATHandler";
import { PayfluxoConnectionHandler } from "../../handlers/PayfluxoConnectionHandler";
import { IAuthenticationFailedNotifyData } from "./AuthenticationFailedNotification";
import { AuthenticationNotification, IAuthenticationNotifyData } from "./AuthenticationNotification";
import { IConnectionNotifyData } from "./ConnectionNotification";
import { INATNotifyData } from "./NATNotification";
import { INotificationModel } from "./NotificationModel";

export class NotificationReader{
    private static validateNotification = (notificationJson: object) => {
        const objectKeys = Object.keys(notificationJson)
        const hasType = objectKeys.includes('type');
        const hasData = objectKeys.includes('data');
        const hasOnlyTwo = objectKeys.length == 2;

        if (hasType && hasData && hasOnlyTwo)
            return
        throw Error("Invalid format notification object");
    }

    public static readNotification = (notificationString: string) => {
        const notificationJson = JSON.parse(notificationString);
        NotificationReader.validateNotification(notificationJson);
        switch(notificationJson['type']){
            case 'AuthenticationNotification':
                const authData: IAuthenticationNotifyData = notificationJson['data']
                AuthenticationHandler.handle(authData);
                break;
            case 'AuthenticationFailedNotification':
                FailedAuthHandler.handle();
                break;
            case 'NATNotification':
                const NATData: INATNotifyData = notificationJson['data'];
                NATHandler.handle(NATData)
                break;
            case 'ConnectionNotification':
                const connData: IConnectionNotifyData = notificationJson['data'];
                PayfluxoConnectionHandler.handle(connData);
                break;

            default:
                throw Error(`Unknown notification type: ${notificationJson['type']}`);
        }
    }
}