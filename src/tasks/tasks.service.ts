import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    let tasks = this.getAllTasks();

    if (filterDto.status) {
      tasks = tasks.filter((task) => task.status === filterDto.status);
    }

    if (filterDto.search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.includes(filterDto.search) ||
          task.description.includes(filterDto.search)
        ) {
          return true;
        } else {
          return false;
        }
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const taskFound = this.tasks.find((task) => task.id === id);

    if (!taskFound) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    } else {
      return taskFound;
    }
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    const foundTask = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== foundTask.id);
  }

  updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
    const task = this.getTaskById(id);
    task.status = updateTaskStatusDto.status;
    return task;
  }
}
