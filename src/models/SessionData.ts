import { UserIdentification } from "./UserIdentification";
import sha256 from 'crypto-js/sha256';


const DEBT_THRESHOLD = 100000
const DEBT_THRESHOLD_RECOVERY = 9000

type PeerDebtState = {
    debt: number;
    choked: boolean;
}

type PeersDebts = {
    [ip: string]: PeerDebtState;
}

export class SessionData {
    private static instance: SessionData;

    private userId: UserIdentification;
    private isAuthenticated: boolean;

    private peersDebt: PeersDebts;

    public constructor() {
        this.peersDebt = {};
    }
    
    public static getInstance = (): SessionData => {
        if (!SessionData.instance)
            SessionData.instance = new SessionData();
        return SessionData.instance;
    }

    public incrementDebt = (ip: string) => {
        const existingIp = Object.keys(this.peersDebt);
        if (existingIp.includes(ip)){
            this.peersDebt[ip].debt += 1;
        }
        else{
            this.peersDebt[ip].debt = 1;
        }
    }

    public decrementDebt = (ip: string, blocksPaid: number): boolean => {
        const existingIp = Object.keys(this.peersDebt);
        if (existingIp.includes(ip)){
            this.peersDebt[ip].debt -= blocksPaid;
            const isChoked = this.peersDebt[ip].choked;
            const isInRecovery = this.peersDebt[ip].debt < DEBT_THRESHOLD_RECOVERY;
            return (isChoked && isInRecovery);
        }
        return false;
    }

    public isPeerIndebted = (ip: string): boolean => {
        const existingIp = Object.keys(this.peersDebt);
        if (existingIp.includes(ip)){
            const shouldChoke = this.peersDebt[ip].debt > DEBT_THRESHOLD;
            this.peersDebt[ip].choked = shouldChoke;
            return shouldChoke;
        }
        else{
            return false;
        }
    }

    public setUserId = (certificate: string, orgMSPID: string) => {
        this.userId = {
            certificate: certificate,
            orgMSPID: orgMSPID
        }
        this.isAuthenticated = true;
    }

    public flushIdentity = () => {
        this.userId = {
            certificate: '',
            orgMSPID: ''
        }
        this.isAuthenticated = false;
    }

    public getIsAuthenticated = (): boolean => {
        return this.isAuthenticated;
    }

    public getIdentity = (): string => {
        if (this.getIsAuthenticated())
        {
            const certificateContent = this.userId.certificate;
            certificateContent.replace('\n', '');
            certificateContent.replace('-----BEGIN CERTIFICATE-----', '');
            certificateContent.replace('-----END CERTIFICATE-----', '');
            const identity = sha256(certificateContent).toString();
            return identity;
        }
        return ''
    }
}