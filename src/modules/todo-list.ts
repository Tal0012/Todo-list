import fs from "fs/promises";
import log from "@ajar/marker";
import { takeCoverage } from "v8";

interface Task {
    id: number;
    title: string;
    isActive: boolean;
}

export default class ToDoList {
    private static uniqueID = 0;

    private constructor(){

    }

    /**********************
     * Public functions
     *********************/

    static read =  async (filter:string): Promise<void> => {
        let tasks: Task[] = await this.loadTasks();
        log.obj(tasks);
    };

    static create = async (title:string):Promise<void> => {
        let tasks: Task[] = await this.loadTasks();
        tasks.push({
            title,
            id: this.generateTaskUid(),
            isActive: true
        });
        this.writeTasks(tasks);
    }

    

    /**********************
     * Private functions
     *********************/
    private static generateTaskUid = (): number => ToDoList.uniqueID++;

    private static loadTasks = async (): Promise<Task[]> => {
        let tasks: Task[];
        try{
            tasks = JSON.parse(await fs.readFile("../todos.json", "utf-8"));
        }catch(err){
            tasks = [];
        }
        return tasks;
    };

    private static writeTasks = async (tasks: Task[]): Promise<void> => {
        await fs.writeFile("../todos.json", JSON.stringify(tasks), "utf-8");
    };
}
