import CommandProcessor from './modules/command-processor.js';
const init = () => {
    const commandProccessor = new CommandProcessor();
    commandProccessor.argvProccessor();
    commandProccessor.start();
    // const todos = new ToDoList();
    // todos.display();
};
init();
