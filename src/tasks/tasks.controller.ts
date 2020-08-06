import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidtionPipe } from './dto/pipes/task-status-validtion.pipe';

@Controller('tasks')
export class TasksController {

    constructor(
        private tasksService: TasksService
    ){}


    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        
        if( Object.keys(filterDto).length > 0 ){
            return this.tasksService.getTasksWithFilters(filterDto);
        } else {
            return this.tasksService.getAllTaasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id:string, @Body('status', TaskStatusValidtionPipe) status: TaskStatus):Task{
        return this.tasksService.updateTaskStatusById(id, status);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): Task{
        return this.tasksService.deleteTaskById(id);
    }
}
