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

interface HelpDescriptions {
    [key: string]: string;
}
export default class CommandProcessor {
    private helpDesc: HelpDescriptions = {
        create: `\nCreate a new task`,
        update: `\nChange task status from active to inactive and vice-versa`,
        remove: `\nRemove task by ID`,
        read: `\nGet all tasks and display them to the console`,
        removecompleted: `\nRemove all completed tasks`
    }
    private helpExmp: HelpDescriptions = {
        create: `\nnode ./dist/app.js create --title='My First Note'\n`,
        update: `\nnode ./dist/app.js update --id=[ID]\n`,
        remove: `\nnode ./dist/app.js remove --id=[ID]\n`,
        read: `\nnode ./dist/app.js read --filter:'Completed'\n`,
        removecompleted: `\nnode ./dist/app.js removecompleted`
    }
    private helpParams: HelpDescriptions = {
        create: `\nTitle: Task's title`,
        update: `\nId: the id of the task you would like to update`,
        remove: `\nId: the id of the task you would like to remove`,
        read: `\nFilter: Filter displayed tasks by: 'All', 'Completed' or 'Open'`,
        removecompleted: `\nNone`
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
        log.obj({ commands: this.commands });
        for (let cmd of this.commands) {
            switch (cmd.title.toLowerCase()) {
                case 'create':
                    if(cmd.arguments.title === undefined){
                        cmd.arguments.title = this.askInput('Title');
                    }
                    await ToDoList.create(cmd.arguments.title);
                    break;
                case 'read':
                    await ToDoList.read(cmd.arguments.filter);
                    break;
                case 'update':
                    if(cmd.arguments.id === undefined){
                        cmd.arguments.id = this.askInput('ID');
                    }
                    await ToDoList.update(cmd.arguments.id);
                    break;
                case 'remove':
                    if(cmd.arguments.id === undefined){
                        cmd.arguments.id = this.askInput('ID');
                    }
                    await ToDoList.remove(cmd.arguments.id);
                    break;
                case 'help':
                    this.printHelper();
                    break;
                case 'removecompleted':
                    ToDoList.removeAllCompleted();
                    break;
                default:
                    log.err(`${cmd.title} command doesn't exist, please check help`);
                    break;
            }
        }
    }

    private printHelper = (): void => {
        log.magenta(`/***********\n/*** Help ** \n/***********/`);
        for (let cmd of Object.keys(this.helpDesc)) {
            log.green(`******* ${cmd[0].toUpperCase() + cmd.slice(1)} *******`)
            log.blue('Description: ', this.helpDesc[cmd]);
            log.blue('Parameters: ', this.helpParams[cmd]);
            log.blue('Example: ', this.helpExmp[cmd]);
        }

    }

    

    private askInput = (inputRequired:string):string =>{
        let waitForInput = true;
        let input ='';
        while(waitForInput){
            // log.green(`Please enter a valid ${inputRequired}:`)
            input = prompt()(`Please enter a valid ${inputRequired}: `);
            console.log(input);
            if(input != ''){
                waitForInput = false;
                break;
            }
            log.red(`${inputRequired} is empty, please try again...`)
        }
        return input;
    }

}