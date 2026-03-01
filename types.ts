
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';
export type PaymentStatus = 'paid' | 'unpaid';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  description: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  clientId: string;
  taskId?: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  invoiceNumber: string;
}

export interface AppState {
  user: User | null;
  clients: Client[];
  tasks: Task[];
  payments: Payment[];
}
