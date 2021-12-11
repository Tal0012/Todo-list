var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs/promises";
import log from "@ajar/marker";
export default class ToDoList {
    constructor() {
        /**********************
         * Public functions
         *********************/
        this.display = () => __awaiter(this, void 0, void 0, function* () {
            const tasks = [{
                    id: this.generateTaskUid(),
                    title: 'test1',
                    isActive: false
                }, {
                    id: this.generateTaskUid(),
                    title: 'test2',
                    isActive: true
                }];
            yield this.writeTasks(tasks);
            const tasksArray = yield this.loadTasks();
            log.obj(tasksArray);
        });
        /**********************
         * Private functions
         *********************/
        this.generateTaskUid = () => Math.random().toString(16).substring(2);
        this.loadTasks = () => __awaiter(this, void 0, void 0, function* () {
            const tasksDataBuffer = yield fs.readFile("../todos.json", "utf-8");
            return JSON.parse(tasksDataBuffer);
        });
        this.writeTasks = (tasks) => __awaiter(this, void 0, void 0, function* () {
            yield fs.writeFile("../todos.json", JSON.stringify(tasks), "utf-8");
        });
    }
}
