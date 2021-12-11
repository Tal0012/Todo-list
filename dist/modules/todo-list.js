var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import fs from "fs/promises";
export default class ToDoList {
    constructor() {
    }
}
_a = ToDoList;
ToDoList.uniqueID = 0;
/**********************
 * Public functions
 *********************/
ToDoList.read = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks = yield _a.loadTasks();
    let filterFunc;
    switch (filter.toLowerCase()) {
        case 'completed':
            filterFunc = (task) => task.isActive === 'false';
            break;
        case 'open':
            filterFunc = (task) => task.isActive === 'true';
            break;
        default:
            filterFunc = (task) => true;
            break;
    }
    _a.printTasks(tasks.filter(filterFunc));
});
ToDoList.create = (title) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks = yield _a.loadTasks();
    tasks.push({
        title,
        id: _a.uidGenerator(),
        isActive: 'true'
    });
    yield _a.writeTasks(tasks);
});
ToDoList.update = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield _a.loadTasks();
    tasks.forEach((task) => {
        if (task.id === id) {
            task.isActive = task.isActive === 'true' ? 'false' : 'true';
        }
    });
    yield _a.writeTasks(tasks);
});
ToDoList.remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks = yield _a.loadTasks();
    tasks = tasks.filter((task) => {
        return task.id !== id;
    });
    yield _a.writeTasks(tasks);
});
/**********************
 * Private functions
 *********************/
ToDoList.uidGenerator = () => Math.random().toString(16).substring(2);
ToDoList.loadTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    let tasks;
    try {
        const data = yield fs.readFile("./todos.json", "utf-8");
        tasks = JSON.parse(data);
    }
    catch (err) {
        tasks = [];
    }
    return tasks;
});
ToDoList.writeTasks = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs.writeFile("./todos.json", JSON.stringify(tasks), "utf-8");
});
ToDoList.printTasks = (tasks) => {
    console.table(tasks.map((task) => {
        task.isActive = task.isActive === 'true' ? "\u2610" : "\u2705";
        return task;
    }));
};
