export interface Todo {
  id: string;
  title: string;
  description: string;
  link: string;
  isRecurring: boolean;
  recurringDays?: number;
  createdAt: string;
  nextDueDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface CompletedTodo extends Todo {
  completedAt: string;
}
