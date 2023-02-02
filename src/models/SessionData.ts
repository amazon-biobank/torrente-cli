import { UserIdentification } from "./UserIdentification";

export class SessionData {
    private static instance: SessionData;

    private userId: UserIdentification;

    public constructor() {
    }
    
    public static getInstance = (): SessionData => {
        if (!SessionData.instance)
            SessionData.instance = new SessionData();
        return SessionData.instance;
    }

    public setUserId = (certificate: string, orgMSPID: string) => {
        this.userId = {
            certificate: certificate,
            orgMSPID: orgMSPID
        }
    }

    public flushIdentity = () => {
        this.userId = {
            certificate: '',
            orgMSPID: ''
        }
    }
}