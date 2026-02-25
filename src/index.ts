import { TaskManager } from './services/TaskManager';
import { Priority, TaskStatus } from './models/Task';
import { DateUtils } from './utils/DateUtils';

// Initialize manager
const manager = new TaskManager();

// Create some dummy users
const admin = { id: "u1", username: "admin", email: "admin@example.com", role: "admin" as const };
const dev = { id: "u2", username: "dev", email: "dev@example.com", role: "user" as const };

console.log("--- Initializing Task System ---");

// Create tasks
const t1 = manager.createTask("Fix critical bug in production", "Null pointer exception in login", Priority.CRITICAL, admin);
const t2 = manager.createTask("Implement new feature", "Add dark mode support", Priority.HIGH, dev);
const t3 = manager.createTask("Update documentation", "Reflect API v2 changes", Priority.LOW);

// Update tasks
manager.updateTask(t1.id, { dueDate: DateUtils.addDays(new Date(), -1) }); // Make it overdue
manager.addTag(t2.id, "frontend");
manager.addTag(t2.id, "ui/ux");

// Complete a task
manager.completeTask(t3.id);

// Query tasks
console.log("
--- High Priority Tasks ---");
const highPriority = manager.filterTasks({ priority: Priority.HIGH });
highPriority.forEach(t => console.log(`[${t.priority}] ${t.title} (${t.status})`));

console.log("
--- Overdue Tasks ---");
const overdue = manager.getOverdueTasks();
overdue.forEach(t => console.log(`[OVERDUE] ${t.title} - Due: ${DateUtils.formatDate(t.dueDate!)}`));

console.log("
--- Statistics ---");
console.table(manager.getTasksByPriorityStats());

console.log("
--- JSON Export ---");
console.log(manager.exportTasksToJSON().substring(0, 200) + "...");
