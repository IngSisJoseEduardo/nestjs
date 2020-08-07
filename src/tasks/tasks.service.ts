import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {


    constructor(
        @InjectRepository(TaskRepository)
        private taskRespository: TaskRepository
    ){}
    
    async getTasks(filterTaskDto:GetTasksFilterDto):Promise<Task[]>{
        return this.taskRespository.getTasks(filterTaskDto);
    }
    
    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRespository.findOne(id);

        if(!found){
            throw new NotFoundException(`Task not found for id: ${id}`)
        }
        return found;
    }


    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRespository.createTask(createTaskDto);    
    }

    async updateTaskStatusById(id:number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(id:number): Promise<void> {
        const result = await this.taskRespository.delete(id);

        if( result.affected === 0){
            throw new NotFoundException(`Not found task by id ${id}`);
            
        }
        console.log('Resultado de eliminar: \n', result);
    }
 
}
