import log from '@ajar/marker';
import ToDoList from './modules/todo-list.js';
const init = () => {
    log.v('hhh');
    //    const commandProccessor = new CommandProcessor();
    //    commandProccessor.argvProccessor();
    const todos = new ToDoList();
    todos.display();
};
init();
