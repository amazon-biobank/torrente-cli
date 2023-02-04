import WebSocket from 'ws';
import { TORRENTE_NOTIFICATION_PORT } from '../config';
import { IAuthenticationMessageData } from '../models/messages/AuthenticationMessage';
import { IClosingMessageData } from '../models/messages/ClosingMessage';
import { IDownloadedBlockMessageData } from '../models/messages/DownloadedBlockMessage';
import { IDownloadIntentionMessageData } from '../models/messages/DownloadIntentionMessage';
import { ILogoutMessageData } from '../models/messages/LogoutMessage';
import { IMessagesModel, MessagesTypesEnum } from '../models/messages/MessageModel';
import { IRedeemValuesMessageData } from '../models/messages/RedeemValuesMessage';
import { IRefreshWalletMessageData } from '../models/messages/RefreshWalletMessage';
import { NotificationReader } from '../models/notifications/NotificationReader';
import { TorrenteConsole } from './Console';

export class TorrenteInterface {
    torrenteSocket: WebSocket;
    connectedResolver: CallableFunction;

    private static instance: TorrenteInterface;

    private endResolver: (value?: unknown) => void = () => {};

    public constructor() { 
        this.connectedResolver = () => {};
    }

    public static getInstance = (): TorrenteInterface => {
        if (!TorrenteInterface.instance)
            TorrenteInterface.instance = new TorrenteInterface;
        return TorrenteInterface.instance;
    }

    private sleep = async(ms: number): Promise<null> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private connect = () => {
        this.torrenteSocket = new WebSocket(`ws://127.0.0.1:${TORRENTE_NOTIFICATION_PORT}`);
        this.torrenteSocket.onopen = this.onOpen;
        this.torrenteSocket.onmessage = this.onMessage;
        this.torrenteSocket.onclose = this.onClose;
        this.torrenteSocket.onerror = this.onError;
    }

    private retryConnection = async () => {
        process.stdout.write(' . ');
        await this.sleep(1000);
        this.connect();
    }

    public initConnection = async(): Promise<void> => {
        const torrenteConsole = TorrenteConsole.getInstance();
        torrenteConsole.log(`Connecting to payfluxo at ${TORRENTE_NOTIFICATION_PORT}`);
        this.connect();
        await this.waitUntilOpen();
    }

    public close = () => {
        const closeMessage: IMessagesModel<IClosingMessageData> = {
            data: {
                message: "closing"
            },
            type: MessagesTypesEnum.Closing
        }
        const closeString = JSON.stringify(closeMessage)
        this.torrenteSocket.send(closeString);
    }

    public logout = () => {
        const logoutMessage: IMessagesModel<ILogoutMessageData> = {
            data: {
                message: "Logging out"
            },
            type: MessagesTypesEnum.Logout
        }
        const logoutString = JSON.stringify(logoutMessage)
        this.torrenteSocket.send(logoutString)
    }

    public redeem = () => {
        const redeemMessage: IMessagesModel<IRedeemValuesMessageData> = {
            data: {
                message: "Redeem"
            },
            type: MessagesTypesEnum.RedeemValues
        }
        const redeemString = JSON.stringify(redeemMessage);
        this.torrenteSocket.send(redeemString)
    }

    public downloadIntention = (downloadData: IDownloadIntentionMessageData) => {
        const downloadIntentionMessage: IMessagesModel<IDownloadIntentionMessageData> = {
            data: downloadData,
            type: MessagesTypesEnum.DownloadIntention
        }
        const downloadIntentionString = JSON.stringify(downloadIntentionMessage);
        this.torrenteSocket.send(downloadIntentionString)
    }

    public refreshWallet = () => {
        const refreshWalletMessage: IMessagesModel<IRefreshWalletMessageData> = {
            data: {
                message: "Refresh wallet"
            },
            type: MessagesTypesEnum.RefreshWallet
        }
        const refreshWalletString = JSON.stringify(refreshWalletMessage)
        this.torrenteSocket.send(refreshWalletString)
    }

    public authenticate = (credentials: IAuthenticationMessageData) => {
        const authData: IMessagesModel<IAuthenticationMessageData> = {
            data: {
                encrypted_content: credentials.encrypted_content,
                password: credentials.password,
                salt: credentials.salt
            },
            type: MessagesTypesEnum.Authentication
        }
        const authString = JSON.stringify(authData)
        this.torrenteSocket.send(authString);
    }

    public downloadBlock = (uploaderIp: string, magneticLink: string, fileSize: number) => {
        const downloadBlockData: IMessagesModel<IDownloadedBlockMessageData> = {
            data: {
                fileSize: fileSize,
                magneticLink: magneticLink,
                uploaderIp: uploaderIp
            },
            type: MessagesTypesEnum.DownloadedBlock
        }
        const downloadBlockString = JSON.stringify(downloadBlockData);
        this.torrenteSocket.send(downloadBlockString)
    }

    private onOpen = (event) => {
        this.connectedResolver();
    }

    private onMessage = (event: WebSocket.MessageEvent) => {
        const torrenteConsole = TorrenteConsole.getInstance();
        torrenteConsole.debug(`${event.data}`)
        try {
            NotificationReader.readNotification(event.data.toString());
        }
        catch (e: any){
            torrenteConsole.error(e.message);
        }
    }

    private onClose = (event) => {
        this.endResolver();
    }

    private onError = (event: WebSocket.ErrorEvent) => {
        switch(event.error['code']){
            case 'ECONNREFUSED':
                this.retryConnection();
                break;
        }
    }

    public waitUntilClose = async (): Promise<void> => {
        if (!this.torrenteSocket){
            return new Promise((resolve, _reject) => {
                resolve(null);
            })
        }
        else{
            const endPromise = new Promise((resolve: (value: void) => void, _reject) => {
                this.endResolver = resolve;
            })
            return endPromise;
        }
    }

    public waitUntilOpen = async(): Promise<void> => {
        if (this.torrenteSocket.readyState === WebSocket.OPEN){
            return new Promise((resolve, _reject) => {
                resolve(null);
            })
        }
        else{
            const conPromise = new Promise((resolve: (value: void) => void, _reject) => {
                this.connectedResolver = resolve;
            })
            return conPromise;
        }
    }
}

