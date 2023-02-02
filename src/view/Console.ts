import chalk from "chalk";
import { createInterface, Interface } from 'readline';
import { AuthenticationCommand } from "./commands/AuthenticateCommand";
import { printHelloTag } from "./HelloTag";

import { LogoutCommand } from "./commands/LogoutCommand";

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
                    // this.torrenteInterface.downloadIntention({
                    //     magneticLink: commandWords[2],
                    //     piecesNumber: parseInt(commandWords[1]),
                    //     torrentId: commandWords[2]
                    // })
                    break;
                case 'balance':
                    const blocksDownloaded = parseInt(commandWords[1])
                    const fileSize = parseInt(commandWords[4])
                    for (let index = 0; index < blocksDownloaded; index++) {
                        // this.torrenteInterface.downloadBlock(
                        //     commandWords[2],
                        //     commandWords[3],
                        //     fileSize
                        //     )
                    }
                    break;
                case 'redeem':
                    // this.torrenteInterface.redeem();
                    break;
                case 'add':
                    // this.torrenteInterface.refreshWallet();
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
        console.log(chalk.yellow(`[x] ${message}`));
    }

    public sucess = (message: string) => {
        console.log(chalk.green(`[+] ${message}`));
    }

    public debug = (message: string) => {
        console.log(chalk.blue(`[+] ${message}`));
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
