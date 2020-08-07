import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    private logger = new Logger('TaskRepository');

    async getTasks(filterTasksDto:GetTasksFilterDto, user: User): Promise<Task[]>{
        const { search, status } =  filterTasksDto;

        const query = this.createQueryBuilder('task');

        query.where('task.userIdwer = :userId', { userId: user.id });

        if( status ) {
            query.andWhere('task.status = :status',{ status });
        }

        if( search ) {
            query.andWhere(`(task.title LIKE :search OR task.description LIKE :search)`,{ search: `%${search}%` });
        }


        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Ocurrio error al consultar los task para el usaurio ${user.username} con el filtro ${JSON.stringify(filterTasksDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto:CreateTaskDto, user: User): Promise<Task>{
        const { title, description } = createTaskDto;

        const task       = new Task();
        task.title       = title;
        task.description = description;
        task.status      = TaskStatus.OPEN;
        task.user        = user;
        
        try {
            await task.save();
            delete task.user;
            return task;
        } catch (error) {
            this.logger.error(`Ocurrio error al crear el task del usaurio: ${user.username}, con la siguiente informacion: ${JSON.stringify(createTaskDto)}`, error.stack);
            throw new InternalServerErrorException();            
        }
    }
}