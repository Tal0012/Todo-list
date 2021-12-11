import log from '@ajar/marker';

interface Command {
    title: string;
    arguments: Arguments;
}

interface Arguments {
    [key: string]: string;
}

export default class CommandProcessor{
    
    private commandsArray: Command[] = [];
    private lastIndex: number = -1;


    argvProccessor = ():void => {
        for(let input of process.argv.slice(2)){
            if(input[0] === '-' && this.lastIndex !== -1){
                const argRegex: RegExp = new RegExp('\-+([a-zA-Z]+)=(.*)');
                const commandArgs : RegExpMatchArray | null = input.match(argRegex);
                if(commandArgs !==null && commandArgs.length >=3){
                    this.commandsArray[this.lastIndex].arguments[commandArgs[1]] = commandArgs[2];
                }
            }else{
                const command:Command = {
                    title: input,
                    arguments: {}
                }
                this.commandsArray.push(command);
                this.lastIndex++;
            }
        }
        log.obj(this.commandsArray);
    }
}