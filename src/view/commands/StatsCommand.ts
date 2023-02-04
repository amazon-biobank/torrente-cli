import { TorrentController } from "../../torrent/TorrentController";
import * as WT from '../../torrent/WebTorrentTypes';
import { TorrenteConsole } from "../Console";

export class StatsCommand {

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
        const progressFormatted = progressString.slice(0, (progressString.indexOf(".")) + 2);
        return `${progressFormatted}%`;
    }

    private static mountTorrentsData = (torrents: WT.Torrent[]): any[] => {
        const data = torrents.map((torrent: WT.Torrent) => {
            const state = StatsCommand.defineState(torrent);
            const progress = StatsCommand.formatProgress(torrent.progress)
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
        const tableData = StatsCommand.mountTorrentsData(torrents);
        tConsole.table(tableData);
    }
}
