import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {


    constructor(
        @InjectRepository(TaskRepository)
        private taskRespository: TaskRepository
    ){}
    
    async getTasks(filterTaskDto:GetTasksFilterDto, user: User):Promise<Task[]>{
        return this.taskRespository.getTasks(filterTaskDto, user);
    }
    
    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRespository.findOne({ where: {id, userId: user.id} });

        if(!found){
            throw new NotFoundException(`Task not found for id: ${id}`)
        }
        return found;
    }


    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRespository.createTask(createTaskDto, user);    
    }

    async updateTaskStatusById(id:number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(id:number, user: User): Promise<void> {
        const result = await this.taskRespository.delete({ id, userId: user.id });

        if( result.affected === 0){
            throw new NotFoundException(`Not found task by id ${id}`);
            
        }
        console.log('Resultado de eliminar: \n', result);
    }
 
}
