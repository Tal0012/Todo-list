import log from '@ajar/marker';
import ToDoList from './todo-list.js';
import prompt from 'prompt-sync';
interface Command {
    title: string;
    arguments: Arguments;
}

interface Arguments {
    [key: string]: string;
}

interface HelpInfo {
    description: string,
    parameters: string,
    examples: string
}
interface HelpObj {
    [key: string]: HelpInfo;
}
export default class CommandProcessor {
    private helpObj: HelpObj = {
        create: {
            description: `Create a new task`,
            parameters: `Title: Task's title`,
            examples: `node ./dist/app.js create --title='My First Note'`
        },
        update: {
            description: `Change task status from active to inactive and vice-versa`,
            parameters: `Id: the id of the task you would like to update`,
            examples: `node ./dist/app.js update --id=[ID]`
        },
        remove: {
            description: `Remove task by ID`,
            parameters: `Id: the id of the task you would like to remove`,
            examples: `node ./dist/app.js remove --id=[ID]`
        },
        read: {
            description: `Get all tasks and display them to the console`,
            parameters: `Filter: Filter displayed tasks by: 'All', 'Completed' or 'Open'`,
            examples: `node ./dist/app.js read --filter:'Completed'`
        },
        removecompleted: {
            description: `Remove all completed tasks`,
            parameters: `None`,
            examples: `node ./dist/app.js removecompleted`
        }
    }

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
        for (let cmd of this.commands) {
            let cmdName = cmd.title.toLowerCase();
            if (cmdName === 'create' || cmdName === 'c') {
                if (cmd.arguments.title === undefined) {
                    cmd.arguments.title = this.askInput('Title');
                }
                await ToDoList.create(cmd.arguments.title);
            } else if (cmdName === 'read'|| cmdName === 'r') {
                if (cmd.arguments.filter === undefined) {
                    cmd.arguments.filter = '';
                }
                await ToDoList.read(cmd.arguments.filter);
            } else if (cmdName === 'update' || cmdName === 'u') {
                if (cmd.arguments.id === undefined) {
                    cmd.arguments.id = this.askInput('ID');
                }
                await ToDoList.update(cmd.arguments.id);
            } else if (cmdName === 'remove'|| cmdName === 'r') {
                if (cmd.arguments.id === undefined) {
                    cmd.arguments.id = this.askInput('ID');
                }
                await ToDoList.remove(cmd.arguments.id);
            } else if (cmdName === 'removecompleted' || cmdName === 'rc') {
                ToDoList.removeAllCompleted();
            } else {
                this.printHelper();
            }
        }
    }

    private printHelper = (): void => {
        log.magenta(`/********************************** Help **********************************/`);
        console.table(this.helpObj);

    }



    private askInput = (inputRequired: string): string => {
        let waitForInput = true;
        let input = '';
        while (waitForInput) {
            input = prompt()(`Please enter a valid ${inputRequired}: `);
            if (input != '') {
                waitForInput = false;
                break;
            }
            log.red(`${inputRequired} is empty, please try again...`)
        }
        return input;
    }

}