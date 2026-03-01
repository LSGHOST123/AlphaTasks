
import { Client, Task, Payment, User, AppState } from './types';

const STORAGE_KEY = 'alphatasks_data';

const DEFAULT_DATA: AppState = {
  user: null,
  clients: [],
  tasks: [],
  payments: [],
};

export const db = {
  getData: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_DATA;
  },

  saveData: (data: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  setUser: (user: User | null) => {
    const data = db.getData();
    db.saveData({ ...data, user });
  },

  addClient: (client: Client) => {
    const data = db.getData();
    db.saveData({ ...data, clients: [...data.clients, client] });
  },

  updateClient: (updated: Client) => {
    const data = db.getData();
    db.saveData({
      ...data,
      clients: data.clients.map(c => c.id === updated.id ? updated : c)
    });
  },

  deleteClient: (id: string) => {
    const data = db.getData();
    db.saveData({
      ...data,
      clients: data.clients.filter(c => c.id !== id),
      tasks: data.tasks.filter(t => t.clientId !== id),
      payments: data.payments.filter(p => p.clientId !== id),
    });
  },

  addTask: (task: Task) => {
    const data = db.getData();
    db.saveData({ ...data, tasks: [...data.tasks, task] });
  },

  updateTask: (updated: Task) => {
    const data = db.getData();
    db.saveData({
      ...data,
      tasks: data.tasks.map(t => t.id === updated.id ? updated : t)
    });
  },

  deleteTask: (id: string) => {
    const data = db.getData();
    db.saveData({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
  },

  addPayment: (payment: Payment) => {
    const data = db.getData();
    db.saveData({ ...data, payments: [...data.payments, payment] });
  },

  updatePayment: (updated: Payment) => {
    const data = db.getData();
    db.saveData({
      ...data,
      payments: data.payments.map(p => p.id === updated.id ? updated : p)
    });
  },

  deletePayment: (id: string) => {
    const data = db.getData();
    db.saveData({ ...data, payments: data.payments.filter(p => p.id !== id) });
  }
};
