import fs from "fs/promises";
import log from "@ajar/marker";

interface Task {
    id: string;
    title: string;
    isActive: boolean;
}

export default class ToDoList {

    constructor() {

    }


    /**********************
     * Public functions
     *********************/
    display = async (): Promise<void> => {
        const tasksArray: Task[] = await this.loadTasks();
        log.obj(tasksArray);
    };

    /**********************
     * Private functions
     *********************/
    private generateTaskUid = (): string => Math.random().toString(16).substring(2);

    private loadTasks = async (): Promise<Task[]> => {
        const tasksDataBuffer = await fs.readFile("../todos.json", "utf-8");
        return JSON.parse(tasksDataBuffer);
    };

    private writeTasks = async (tasks: Task[]): Promise<void> => {
        await fs.writeFile("../todos.json", JSON.stringify(tasks), "utf-8");
    };
}
