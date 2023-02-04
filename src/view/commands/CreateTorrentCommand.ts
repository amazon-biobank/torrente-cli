import { SessionData } from "../../models/SessionData";
import { TorrentController } from "../../torrent/TorrentController";
import { TorrentHandler } from "../../torrent/TorrentHandlers";
import { TorrenteConsole } from "../Console";

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
            const onWireAuthenticated = TorrentHandler.onWireAuthenticated(torrent);
            torrent.on('wire', onWireAuthenticated);
        }
        else{
            torrent.on('wire', TorrentHandler.onWire)
        }
    }
}
