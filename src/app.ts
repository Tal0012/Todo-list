import CommandProcessor from './modules/command-processor.js';
import log from '@ajar/marker';
import ToDoList from './modules/todo-list.js';
import fs from 'fs';



const init = () => {
    const commandProccessor = new CommandProcessor();
    commandProccessor.argvProccessor();
    commandProccessor.start();
}



init();