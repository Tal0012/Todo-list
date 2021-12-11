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
                    default:
                        log.err(`${cmd.title} command doesn't exist`);
                        break;
                }
            }
        });
    }
}
