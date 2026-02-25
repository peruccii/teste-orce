import { TaskManager } from '../src/services/TaskManager';
import { Priority, TaskStatus } from '../src/models/Task';

describe('TaskManager', () => {
    let manager: TaskManager;

    beforeEach(() => {
        manager = new TaskManager();
    });

    test('should create a task successfully', () => {
        const task = manager.createTask('Test Task', 'Description');
        expect(task.id).toBeDefined();
        expect(task.title).toBe('Test Task');
        expect(task.status).toBe(TaskStatus.PENDING);
    });

    test('should update task status', () => {
        const task = manager.createTask('Test Task', 'Description');
        const updated = manager.updateTask(task.id, { status: TaskStatus.IN_PROGRESS });
        expect(updated.status).toBe(TaskStatus.IN_PROGRESS);
    });

    test('should filter tasks by priority', () => {
        manager.createTask('Low Priority', 'Desc', Priority.LOW);
        manager.createTask('High Priority', 'Desc', Priority.HIGH);
        
        const highPriorityTasks = manager.filterTasks({ priority: Priority.HIGH });
        expect(highPriorityTasks.length).toBe(1);
        expect(highPriorityTasks[0].title).toBe('High Priority');
    });

    test('should identify overdue tasks', () => {
        const task = manager.createTask('Overdue Task', 'Desc');
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        
        manager.updateTask(task.id, { dueDate: pastDate });
        
        const overdue = manager.getOverdueTasks();
        expect(overdue.length).toBe(1);
        expect(overdue[0].id).toBe(task.id);
    });

    test('should delete a task', () => {
        const task = manager.createTask('To Delete', 'Desc');
        const deleted = manager.deleteTask(task.id);
        expect(deleted).toBe(true);
        expect(manager.getTask(task.id)).toBeUndefined();
    });
});
