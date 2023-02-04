import { SessionData } from "../../models/SessionData";
import { TorrentController } from "../../torrent/TorrentController";
import { TorrenteConsole } from "../Console";
import { TorrenteInterface } from "../TorrenteInterface";
import * as WT from 'bittorrent-protocol'

export class CreateTorrentCommand {
    public static activate = async() => {
        const tConsole = TorrenteConsole.getInstance();
        const filepath = await tConsole.ask('Create torrent: insert file path\n> ');
        const torrentName = await tConsole.ask('Create torrent: How it will be named?\n> ');
        const comments = await tConsole.ask('Create torrent: Comments about this torrent?\n> ');
        const metadata = await tConsole.ask('Create torrent: insert path to desired metadata json\n> ');

        const tController = TorrentController.getInstance();
        const torrent = tController.upload(filepath, torrentName, comments, metadata);

        const userData = SessionData.getInstance();
        if (userData.getIsAuthenticated()){
            torrent.on('wire', (wire: WT.Wire, addr: string) => {
                tConsole.debug(`Connected to peer with address ${addr}`);
                const ip = addr.substring(0, addr.lastIndexOf(':'));
                wire.on('upload', (bytes: number) => {
                    const blockNumbers = Math.ceil(bytes / 16384);
                    for (let index = 0; index < blockNumbers; index++) {
                        userData.incrementDebt(ip);
                        if (userData.isPeerIndebted(ip)){
                            wire.choke();
                        }
                    }
                })
            })
        }
    }
}