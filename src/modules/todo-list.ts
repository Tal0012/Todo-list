import fs from "fs/promises";
import log from "@ajar/marker";

interface Task {
    id: string;
    title: string;
    isActive: string;
}

export default class ToDoList {
    private static uniqueID : string;

    private constructor() {

    }

    /**********************
     * Public functions
     *********************/

    static read = async (filter: string): Promise<void> => {
        let tasks: Task[] = await this.loadTasks();
        let filterFunc: (task:Task) => boolean;
        switch(filter.toLowerCase()){
            case 'completed':
                filterFunc = (task:Task) => task.isActive === 'false';
                break;
            case 'open':
                filterFunc = (task:Task) => task.isActive === 'true';
                break;
            default:
                filterFunc = (task:Task) => true;
                break;
        }
        this.printTasks(tasks.filter(filterFunc));
    };

    static create = async (title: string): Promise<void> => {
        let tasks: Task[] = await this.loadTasks();
        tasks.push({
            title,
            id: this.uidGenerator(),
            isActive: 'true'
        });
        await this.writeTasks(tasks);
    }

    static update = async (id: string): Promise<void> => {
        const tasks: Task[] = await this.loadTasks();
        tasks.forEach((task: Task): void => {
            if (task.id === id) {
                task.isActive = task.isActive === 'true' ? 'false' : 'true';
            }
        });
        await this.writeTasks(tasks);
    }

    static remove = async (id: string): Promise<void> => {
        let tasks: Task[] = await this.loadTasks();
        tasks = tasks.filter((task: Task): boolean => {
            return task.id !== id;
        });
        await this.writeTasks(tasks);
    }

    static removeAllCompleted = async () : Promise<void> => {
        let tasks: Task[] = await this.loadTasks();
        await this.writeTasks(tasks.filter((task:Task)=> {
            return task.isActive === 'true';
        }));
    }



    /**********************
     * Private functions
     *********************/
    static uidGenerator = (): string => Math.random().toString(16).substring(2);

    private static loadTasks = async (): Promise<Task[]> => {
        let tasks: Task[];
        try {
            const data = await fs.readFile("./todos.json", "utf-8");
            tasks = JSON.parse(data);
        } catch (err) {
            tasks = [];
        }
        return tasks;
    };

    private static writeTasks = async (tasks: Task[]): Promise<void> => {
        await fs.writeFile("./todos.json", JSON.stringify(tasks), "utf-8");
    };

    private static printTasks = (tasks: Task[]): void => {
        console.table(tasks.map((task:Task):Task => {
            task.isActive = task.isActive === 'true' ? "\u2610" : "\u2705";
            return task;
        }));
    }
}
