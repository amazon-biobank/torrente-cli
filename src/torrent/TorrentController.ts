import WebTorrent from "webtorrent-hybrid";
import * as WT from './WebTorrentTypes'
import * as BT from 'bittorrent-protocol'
import { SessionData } from "../models/SessionData";
import { TorrenteConsole } from "../view/Console";
import { CreateTorrentOptions } from "./create-torrent";

type PaymentControl = {
    [wireId: string]: BT.Wire;
}

const TORRENT_PORT = 25000

export class TorrentController {
    private static instance: TorrentController;
    private static client: WT.Instance;

    private static paymentControl: PaymentControl;

    public constructor() {
        TorrentController.client = new WebTorrent(
            { torrentPort: TORRENT_PORT }
        );
        TorrentController.paymentControl = {};
    }

    public static getInstance = (): TorrentController => {
        if (!TorrentController.instance)
            TorrentController.instance = new TorrentController();
        return TorrentController.instance;
    }

    public getTorrents = (): WT.Torrent[] => {
        return TorrentController.client.torrents;
    }

    private static generateWireId = (magneticLink: string, peerAddr: string): string => {
        return `${magneticLink}@${peerAddr}`
    }

    public addWire = (magneticLink: string, peerAddr: string, wire: BT.Wire) => {
        const wireId = TorrentController.generateWireId(magneticLink, peerAddr);
        TorrentController.paymentControl[wireId] = wire;
    }

    public unchokeWire = (ip: string, magneticLink: string) => {
        const wireId = TorrentController.generateWireId(magneticLink, ip);
        const wire = TorrentController.paymentControl[wireId];
        wire.unchoke();
    }

    private onTorrentAdded = (torrent: WT.Torrent) => {
        const tConsole = TorrenteConsole.getInstance();
        tConsole.sucess(`Torrent ${torrent.name} has been added`);
    }

    private onSeedStarted = (torrent: WT.Torrent) => {
        const tConsole = TorrenteConsole.getInstance();
        tConsole.sucess(`Torrent ${torrent.name} has started seeding`);
    }

    public download = (magneticLink: string): WT.Torrent => {
        return TorrentController.client.add(
            magneticLink,
            {
                skipVerify: false
            },
            this.onTorrentAdded)
    }

    public upload = (filepath: string, name: string, comment?: string, metadata?: any): WT.Torrent => {
        const sessionData = SessionData.getInstance();
        const identity = sessionData.getIdentity()
        const torrentOptions: CreateTorrentOptions = {
            name: name,
            createdBy: identity,
            comment: comment,
            info: metadata,
            pieceLength: 16 * 1024
        }
        return TorrentController.client.seed(filepath, torrentOptions, this.onSeedStarted);
    }
}
