var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import log from '@ajar/marker';
import ToDoList from './todo-list.js';
export default class CommandProcessor {
    constructor() {
        this.helpDesc = {
            create: `\nCreate a new task`,
            update: `\nChange task status from active to inactive and vice-versa`,
            remove: `\nRemove task by ID`,
            read: `\nGet all tasks and display them to the console`
        };
        this.helpExmp = {
            create: `\nnode ./dist/app.js create --title='My First Note'\n`,
            update: `\nnode ./dist/app.js update --id=[ID]\n`,
            remove: `\nnode ./dist/app.js remove --id=[ID]\n`,
            read: `\nnode ./dist/app.js read --filter:'Completed'\n`
        };
        this.helpParams = {
            create: `\nTitle: Task's title`,
            update: `\nId: the id of the task you would like to update`,
            remove: `\nId: the id of the task you would like to remove`,
            read: `\nFilter: Filter displayed tasks by: 'All', 'Completed' or 'Open'`
        };
        this.commands = [];
        this.lastIndex = -1;
        this.argvProccessor = () => {
            for (let input of process.argv.slice(2)) {
                if (input[0] === '-' && this.lastIndex !== -1) {
                    const argRegex = new RegExp('\-+([a-zA-Z]+)=(.*)');
                    const commandArgs = input.match(argRegex);
                    if (commandArgs !== null && commandArgs.length >= 3) {
                        this.commands[this.lastIndex].arguments[commandArgs[1]] = commandArgs[2];
                    }
                }
                else {
                    const command = {
                        title: input,
                        arguments: {}
                    };
                    this.commands.push(command);
                    this.lastIndex++;
                }
            }
        };
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            log.obj({ commands: this.commands });
            for (let cmd of this.commands) {
                switch (cmd.title.toLowerCase()) {
                    case 'create':
                        yield ToDoList.create(cmd.arguments.title);
                        break;
                    case 'read':
                        yield ToDoList.read(cmd.arguments.filter);
                        break;
                    case 'update':
                        yield ToDoList.update(cmd.arguments.id);
                        break;
                    case 'remove':
                        yield ToDoList.remove(cmd.arguments.id);
                        break;
                    case 'help':
                        this.printHelper();
                        break;
                    default:
                        log.err(`${cmd.title} command doesn't exist, please check help`);
                        break;
                }
            }
        });
        this.printHelper = () => {
            log.magenta(`/***********\n/*** Help ** \n/***********/`);
            for (let cmd of Object.keys(this.helpDesc)) {
                log.green(`******* ${cmd[0].toUpperCase() + cmd.slice(1)} *******`);
                log.blue('Description: ', this.helpDesc[cmd]);
                log.blue('Parameters: ', this.helpParams[cmd]);
                log.blue('Example: ', this.helpExmp[cmd]);
            }
        };
    }
}
