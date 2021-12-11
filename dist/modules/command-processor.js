import log from '@ajar/marker';
export default class CommandProcessor {
    constructor() {
        this.commandsArray = [];
        this.lastIndex = -1;
        this.argvProccessor = () => {
            for (let input of process.argv.slice(2)) {
                if (input[0] === '-' && this.lastIndex !== -1) {
                    const argRegex = new RegExp('\-+([a-zA-Z]+)=(.*)');
                    const commandArgs = input.match(argRegex);
                    if (commandArgs !== null && commandArgs.length >= 3) {
                        this.commandsArray[this.lastIndex].arguments[commandArgs[1]] = commandArgs[2];
                    }
                }
                else {
                    const command = {
                        title: input,
                        arguments: {}
                    };
                    this.commandsArray.push(command);
                    this.lastIndex++;
                }
            }
            log.obj(this.commandsArray);
        };
    }
}
