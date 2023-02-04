import { TorrenteConsole } from "./view/Console";
import { TorrenteInterface } from "./view/TorrenteInterface";


const console = TorrenteConsole.getInstance();
const torrenteInterface = TorrenteInterface.getInstance();
torrenteInterface.initConnection().then(() => {
	console.startConsole();
})
