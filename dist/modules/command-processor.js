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
import prompt from 'prompt-sync';
export default class CommandProcessor {
    constructor() {
        this.helpObj = {
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
                        if (cmd.arguments.title === undefined) {
                            cmd.arguments.title = this.askInput('Title');
                        }
                        yield ToDoList.create(cmd.arguments.title);
                        break;
                    case 'read':
                        yield ToDoList.read(cmd.arguments.filter);
                        break;
                    case 'update':
                        if (cmd.arguments.id === undefined) {
                            cmd.arguments.id = this.askInput('ID');
                        }
                        yield ToDoList.update(cmd.arguments.id);
                        break;
                    case 'remove':
                        if (cmd.arguments.id === undefined) {
                            cmd.arguments.id = this.askInput('ID');
                        }
                        yield ToDoList.remove(cmd.arguments.id);
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
        });
        this.printHelper = () => {
            log.magenta(`/********************************** Help **********************************/`);
            console.table(this.helpObj);
        };
        this.askInput = (inputRequired) => {
            let waitForInput = true;
            let input = '';
            while (waitForInput) {
                input = prompt()(`Please enter a valid ${inputRequired}: `);
                if (input != '') {
                    waitForInput = false;
                    break;
                }
                log.red(`${inputRequired} is empty, please try again...`);
            }
            return input;
        };
    }
}
