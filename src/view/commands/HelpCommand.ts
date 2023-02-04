import { TorrenteConsole } from "../Console";

export class HelpCommand {

    private static mountHelpData = (): any[] => {
        const data = [
            { command: 'authenticate', description: 'Inform a credentials path, decrypt it and log in' },
            { command: 'close', description: 'Closes torrente and payfluxo' },
            { command: 'logout', description: 'If authenticated, drop credentials (Authenticated only)' },
            { command: 'status', description: 'Check current loaded torrents' },
            { command: 'info', description: 'Get details about one torrent' },
            { command: 'balance', description: 'Checks wallet content (Authenticated only)' },
            { command: 'redeem', description: 'Redeems micropayments tokens against smart contract (Authenticated only)' },
            { command: 'add', description: 'Add torrent to the download list' },
            { command: 'create', description: 'Create new torrent' },
            { command: 'debug', description: 'Toggles debug logs'}
        ];
        return data;
    }

    public static activate = async () => {
        const tConsole = TorrenteConsole.getInstance();
        const tableData = HelpCommand.mountHelpData();
        tConsole.table(tableData);
    }
}
