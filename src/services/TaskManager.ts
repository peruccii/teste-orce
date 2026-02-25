import { Task, TaskStatus, Priority, TaskFilter, User } from '../models/Task';
import { DateUtils } from '../utils/DateUtils';
import { StringUtils } from '../utils/StringUtils';

export class TaskManager {
    private tasks: Map<string, Task> = new Map();

    constructor(initialTasks: Task[] = []) {
        initialTasks.forEach(task => this.tasks.set(task.id, task));
    }

    createTask(title: string, description: string, priority: Priority = Priority.MEDIUM, assignee?: User): Task {
        const id = StringUtils.generateRandomId();
        const now = new Date();
        
        const newTask: Task = {
            id,
            title,
            description,
            priority,
            status: TaskStatus.PENDING,
            assignee,
            createdAt: now,
            updatedAt: now,
            tags: []
        };

        this.tasks.set(id, newTask);
        return newTask;
    }

    getTask(id: string): Task | undefined {
        return this.tasks.get(id);
    }

    updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
        const task = this.tasks.get(id);
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }

        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date()
        };

        this.tasks.set(id, updatedTask);
        return updatedTask;
    }

    deleteTask(id: string): boolean {
        return this.tasks.delete(id);
    }

    completeTask(id: string): Task {
        return this.updateTask(id, { status: TaskStatus.COMPLETED });
    }

    addTag(id: string, tag: string): Task {
        const task = this.getTask(id);
        if (!task) throw new Error("Task not found");
        
        const tags = [...new Set([...task.tags, StringUtils.slugify(tag)])];
        return this.updateTask(id, { tags });
    }

    filterTasks(filter: TaskFilter): Task[] {
        let results = Array.from(this.tasks.values());

        if (filter.status) {
            results = results.filter(t => t.status === filter.status);
        }

        if (filter.priority) {
            results = results.filter(t => t.priority === filter.priority);
        }

        if (filter.assigneeId) {
            results = results.filter(t => t.assignee?.id === filter.assigneeId);
        }

        if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            results = results.filter(t => 
                t.title.toLowerCase().includes(query) || 
                (t.description && t.description.toLowerCase().includes(query))
            );
        }

        return results;
    }

    getOverdueTasks(): Task[] {
        const now = new Date();
        return Array.from(this.tasks.values()).filter(t => 
            t.dueDate && DateUtils.isOverdue(t.dueDate) && t.status !== TaskStatus.COMPLETED
        );
    }

    getTasksByPriorityStats(): Record<Priority, number> {
        const stats: Record<Priority, number> = {
            [Priority.LOW]: 0,
            [Priority.MEDIUM]: 0,
            [Priority.HIGH]: 0,
            [Priority.CRITICAL]: 0
        };

        this.tasks.forEach(task => {
            stats[task.priority]++;
        });

        return stats;
    }

    exportTasksToJSON(): string {
        return JSON.stringify(Array.from(this.tasks.values()), null, 2);
    }
}
