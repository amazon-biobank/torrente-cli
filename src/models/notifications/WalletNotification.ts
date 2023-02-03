import { INotificationModel, NotificationTypesEnum } from "./NotificationModel";

export type TorrenteWallet = {
    available: number,
    frozen: number,
    redeemable: number
}

export interface IWalletRefreshData {
    wallet: TorrenteWallet;
}

export class WalletRefreshNotification implements INotificationModel <IWalletRefreshData>{
    data: IWalletRefreshData;
    type: NotificationTypesEnum;

    constructor(data: IWalletRefreshData){
        this.type = NotificationTypesEnum.WalletNotification;
        this.data = data;
    }

    getWalletRefreshData(): IWalletRefreshData{
        return this.data;
    }

    getNotificationObject(): INotificationModel<IWalletRefreshData>{
        return {
            type: this.type,
            data: this.data
        };
    }

}
