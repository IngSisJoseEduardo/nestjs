import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];


    getAllTaasks():Task[]{
        return this.tasks;
    }

    getTasksWithFilters(filterDto:GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTaasks();

        if(status){
            tasks = tasks.filter( task => task.status === status);
        }

        if(search){
            tasks = tasks.filter(task => 
                task.title.includes( search ) || 
                task.description.includes( search ),

            );
        }
        return tasks;
    }

    getTaskById(id: string): Task{
        const found = this.tasks.find( task => task.id === id);

        if(!found){
            throw new NotFoundException(`Task not found for id: ${id}`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
    }

    updateTaskStatusById(id:string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;

        return task;
    }

    deleteTaskById(id: string):Task {
        let taskDelete: Task;

        const found = this.getTaskById(id);
        for (const [index, task] of this.tasks.entries()) {
            if(task.id === found.id){
                taskDelete = this.tasks.splice(index,1)[0];
            }
        }

        return taskDelete;
    }   
}
