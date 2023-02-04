import { TorrenteConsole } from "../view/Console"
import * as BT from 'bittorrent-protocol'
import { TorrentController } from "./TorrentController";
import { TorrenteInterface } from "../view/TorrenteInterface";
import { SessionData } from "../models/SessionData";
import * as WT from 'webtorrent'

export class TorrentHandler {

    public static onWireAuthenticated = (torrent: WT.Torrent): (wire: BT.Wire, addr?: string) => WT.Torrent  => {
        const _onWireAuthenticated = (wire: BT.Wire, addr?: string): WT.Torrent => {
            const tConsole = TorrenteConsole.getInstance();
            const tController = TorrentController.getInstance();
            const tInterface = TorrenteInterface.getInstance();
            const userData = SessionData.getInstance();

            const magneticLink = torrent.magnetURI;
    
            tConsole.debug(`Connected to peer with address ${addr}`);
            const ip = addr.substring(0, addr.lastIndexOf(':'));
            tController.addWire(magneticLink, addr, wire);
            wire.on('download', (bytes: number) => {
                const blockNumbers = Math.ceil(bytes / 16384);
                tConsole.debug(`Downloaded ${bytes} bytes`);
                for (let index = 0; index < blockNumbers; index++) {
                    tInterface.downloadBlock(
                        ip,
                        magneticLink,
                        torrent.pieces.length
                    )
                }
            })
            wire.on('upload', (bytes: number) => {
                const blockNumbers = Math.ceil(bytes / 16384);
                for (let index = 0; index < blockNumbers; index++) {
                    userData.incrementDebt(ip);
                    if (userData.isPeerIndebted(ip)){
                        wire.choke();
                    }
                }
            })
            return torrent;
        }
        return _onWireAuthenticated
    }

    public static onWire = (wire: BT.Wire, addr: string) => {
        const tConsole = TorrenteConsole.getInstance();
        tConsole.debug(`Connected to peer with address ${addr}`);
        const ip = addr.substring(0, addr.lastIndexOf(':'));
        wire.on('download', (bytes: number) => {
            const blockNumbers = Math.ceil(bytes / 16384);
            tConsole.debug(`Downloaded ${blockNumbers} bytes to ${ip}`);
        })
        wire.on('upload', (bytes: number) => {
            const blockNumbers = Math.ceil(bytes / 16384);
            tConsole.debug(`Uploaded ${blockNumbers} bytes to ${ip}`);
        })
    }
}
