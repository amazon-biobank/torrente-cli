import { TorrentController } from "../../torrent/TorrentController";
import * as WT from '../../torrent/WebTorrentTypes';
import { TorrenteConsole } from "../Console";

export class InfoCommand {

    private static defineState = (torrent: WT.Torrent): string => {
        var state = 'not ready';
        if (torrent.ready)
            state = 'ready';
        if (torrent.done)
            state = 'done';
        if (torrent.paused)
            state = 'paused';
        return state;
    }

    private static formatProgress = (progress: number): string => {
        const progressString = (progress * 100).toString();
        var progressFormatted;
        if (progressString !== '100')
            progressFormatted = progressString.slice(0, (progressString.indexOf(".")) + 2);
        else
            progressFormatted = progressString;
        return `${progressFormatted}%`;
    }

    private static mountTorrentsData = (torrents: WT.Torrent[]): any[] => {
        const data = torrents.map((torrent: WT.Torrent) => {
            const state = InfoCommand.defineState(torrent);
            const progress = InfoCommand.formatProgress(torrent.progress)
            return { 
                name: torrent.name,
                progress: progress,
                peers: torrent.numPeers,
                timeRemaining: torrent.timeRemaining,
                state: state
            }
        })
        return data;
    }

    public static activate = async () => {
        const tConsole = TorrenteConsole.getInstance();
        const tController = TorrentController.getInstance();
        const torrents = tController.getTorrents();
        const tableData = InfoCommand.mountTorrentsData(torrents);
        tConsole.table(tableData);
        const whichTorrent = parseInt(await tConsole.ask('Which torrent to check? (Input index number)\n> '));
        const torrentToInfo = torrents[whichTorrent];
        tConsole.log(`Torrent name: ${torrentToInfo.name}`);
        tConsole.log(`Magnetic link: ${torrentToInfo.magnetURI}`);
        tConsole.log(`Comments: ${torrentToInfo.comment}`);
        tConsole.log(`Pieces number: ${torrentToInfo.pieces.length}`);
        tConsole.log(`Pieces size: ${torrentToInfo.pieceLength}`);
        tConsole.log(`Size: ${torrentToInfo.length / (1024 * 1024)} MB`);
        tConsole.log(`Info Hash: ${torrentToInfo.infoHash}`);
    }
}
