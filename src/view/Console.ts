import { printHelloTag } from "./HelloTag"
import { createInterface, Interface } from "readline"
import { TorrenteInterface } from "./TorrenteInterface";

export class TorrenteConsole {
    commandsInterface: Interface;
    torrenteInterface: TorrenteInterface;

    public constructor() {
        this.commandsInterface = createInterface({
            input: process.stdin,
            output: process.stdout
        })
        this.torrenteInterface = new TorrenteInterface();
    }

    private commandReaction = (value: string) => {
        const commandWords = value.split(' ');
        switch (commandWords[0]){
            case 'authenticate':
                // this.torrenteInterface.authenticate();
                break;
            case 'close':
                process.exit();
            case 'logout':
                this.torrenteInterface.logout();
                break;
            case 'status':
                this.torrenteInterface.downloadIntention({
                    magneticLink: commandWords[2],
                    piecesNumber: parseInt(commandWords[1]),
                    torrentId: commandWords[2]
                })
                break;
            case 'balance':
                const blocksDownloaded = parseInt(commandWords[1])
                const fileSize = parseInt(commandWords[4])
                for (let index = 0; index < blocksDownloaded; index++) {
                    this.torrenteInterface.downloadBlock(
                        commandWords[2],
                        commandWords[3],
                        fileSize
                        )
                }
                break;
            case 'redeem':
                this.torrenteInterface.redeem();
                break;
            case 'add':
                this.torrenteInterface.refreshWallet();
                break;
            case '':
                break;
            default:
                console.log('Unknown command!');
                break;
        }
    
        this.askForCommand();
    }

    private askForCommand = () => {
        this.commandsInterface.question("> ", (value: string) => {
            this.commandReaction(value);
        })
    }

    public startConsole = async () => {
        await this.torrenteInterface.initConnection();
        printHelloTag();
        this.askForCommand();
    }
}
