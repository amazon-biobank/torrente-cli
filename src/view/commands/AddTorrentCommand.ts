import { IDownloadIntentionMessageData } from "../../models/messages/DownloadIntentionMessage";
import { SessionData } from "../../models/SessionData";
import { TorrentController } from "../../torrent/TorrentController";
import { TorrentHandler } from "../../torrent/TorrentHandlers";
import { TorrenteConsole } from "../Console";
import { TorrenteInterface } from "../TorrenteInterface";


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
            const onWireAuthenticated = TorrentHandler.onWireAuthenticated(torrent);
            torrent.on('wire', onWireAuthenticated);
        }
        else{
            torrent.on('wire', TorrentHandler.onWire);
        }

    }
}