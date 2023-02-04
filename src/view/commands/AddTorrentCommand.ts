import { IDownloadIntentionMessageData } from "../../models/messages/DownloadIntentionMessage";
import { SessionData } from "../../models/SessionData";
import { TorrentController } from "../../torrent/TorrentController";
import { TorrenteConsole } from "../Console";
import { TorrenteInterface } from "../TorrenteInterface"
import * as WT from 'bittorrent-protocol'


export class AddTorrentCommand {
    public static activate = async () => {
        const tConsole = TorrenteConsole.getInstance();
        const magneticLink = await tConsole.ask('Add torrent: paste the magnetic link of the desired torrent\n> ');

        const tController = TorrentController.getInstance();
        const torrent = tController.download(magneticLink);

        const userData = SessionData.getInstance();

        torrent.on('done', () => {
            tConsole.sucess(`${torrent.name} download completed.`)
            torrent.files.forEach(file => {
                tConsole.log(`[${torrent.name}]: ${file.name} stored at ${file.path}`);
            })
        })

        if (userData.getIsAuthenticated()){
            const tInterface = TorrenteInterface.getInstance();
            const downloadData: IDownloadIntentionMessageData = {
                magneticLink: magneticLink,
                piecesNumber: torrent.pieces.length,
                torrentId: torrent.infoHash
            }
            tInterface.downloadIntention(downloadData);
            torrent.on('wire', (wire: WT.Wire, addr: string) => {
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
            })
        }

    }
}