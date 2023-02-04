import chalk from "chalk";
import { createInterface, Interface } from 'readline';
import { AuthenticationCommand } from "./commands/AuthenticateCommand";
import { printHelloTag } from "./HelloTag";

import { LogoutCommand } from "./commands/LogoutCommand";
import { BalanceCommand } from "./commands/BalanceCommand";
import { RedeemCommand } from "./commands/RedeemCommand";
import { AddTorrentCommand } from "./commands/AddTorrentCommand";
import { CreateTorrentCommand } from "./commands/CreateTorrentCommand";
import { StatsCommand } from "./commands/StatsCommand";
import { InfoCommand } from "./commands/InfoCommand";
import { HelpCommand } from "./commands/HelpCommand";

export class TorrenteConsole {
    private commandsInterface: Interface;
    private static instance: TorrenteConsole;

    public constructor() {
        this.commandsInterface = createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        })
    }

    public static getInstance = (): TorrenteConsole => {
        if (!TorrenteConsole.instance) {
            TorrenteConsole.instance = new TorrenteConsole();
        }
        return TorrenteConsole.instance;
    }

    private commandReaction = async (value: string) => {
        const commandWords = value.split(' ');
        try{
            switch (commandWords[0]){
                case 'authenticate':
                    await AuthenticationCommand.activate();
                    break;
                case 'close':
                    process.exit();
                case 'logout':
                    await LogoutCommand.activate();
                    break;
                case 'status':
                    await StatsCommand.activate();
                    break;
                case 'balance':
                    await BalanceCommand.activate();
                    break;
                case 'redeem':
                    await RedeemCommand.activate();
                    break;
                case 'add':
                    await AddTorrentCommand.activate();
                    break;
                case 'create':
                    await CreateTorrentCommand.activate();
                    break;
                case 'info':
                    await InfoCommand.activate();
                    break;
                case 'help':
                    await HelpCommand.activate();
                    break;
                case '':
                    break;
                default:
                    this.error('Unknown command! try "help"');
                    break;
            }
        }
        catch (e: any) {
            this.error(e.message);
        }
    }

    public log = (message: string) => {
        console.log(chalk.white(`[*] ${message}`));
    }

    public error = (message: string) => {
        console.log(chalk.red(`[x] ${message}`));
    }

    public warn = (message: string) => {
        console.log(chalk.yellow(`[!] ${message}`));
    }

    public sucess = (message: string) => {
        console.log(chalk.green(`[+] ${message}`));
    }

    public debug = (message: string) => {
        console.log(chalk.blue(`[?] ${message}`));
    }

    public table = (structData: Object[]) => {
        console.table(structData);
    }

    public ask = async (prompt: string): Promise<string> => {
        return new Promise<string>(resolve => {
            this.commandsInterface.question(`> ${prompt}`, input => resolve(input))
        })
    }

    public enableCommands = async () => {
        while (true){
            const command = await this.ask("");
            await this.commandReaction(command);
        }
    }

    public startConsole = async () => {
        printHelloTag();
    }
}
