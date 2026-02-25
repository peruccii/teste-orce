export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: "admin" | "user" | "guest";
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    assignee?: User;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
}

export interface TaskFilter {
    status?: TaskStatus;
    priority?: Priority;
    assigneeId?: string;
    searchQuery?: string;
}
