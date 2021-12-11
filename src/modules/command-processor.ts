import log from '@ajar/marker';
import ToDoList from './todo-list.js';

interface Command {
    title: string;
    arguments: Arguments;
}

interface Arguments {
    [key: string]: string;
}

export default class CommandProcessor {

    private commands: Command[] = [];
    private lastIndex: number = -1;


    argvProccessor = (): void => {
        for (let input of process.argv.slice(2)) {
            if (input[0] === '-' && this.lastIndex !== -1) {
                const argRegex: RegExp = new RegExp('\-+([a-zA-Z]+)=(.*)');
                const commandArgs: RegExpMatchArray | null = input.match(argRegex);
                if (commandArgs !== null && commandArgs.length >= 3) {
                    this.commands[this.lastIndex].arguments[commandArgs[1]] = commandArgs[2];
                }
            } else {
                const command: Command = {
                    title: input,
                    arguments: {}
                }
                this.commands.push(command);
                this.lastIndex++;
            }
        }
    }

    start = async (): Promise<void> => {
        log.obj({ commands: this.commands});
        for (let cmd of this.commands) {
            switch (cmd.title.toLowerCase()) {
                case 'create':
                     await ToDoList.create(cmd.arguments.title);
                    break;
                case 'read':
                     await ToDoList.read(cmd.arguments.filter);
                    break;
                case 'update':
                    await ToDoList.update(cmd.arguments.id);
                    break;
                case 'remove':
                    await ToDoList.remove(cmd.arguments.id);
                    break;
                default:
                    log.err(`${cmd.title} command doesn't exist`);
                    break;
            }
        }
    }


}