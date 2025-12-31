import type { Todo, CompletedTodo } from '../types';

const DB_NAME = 'TodoServerDB';
const DB_VERSION = 1;
const TODOS_STORE = 'todos';
const COMPLETED_STORE = 'completedTodos';

/**
 * IndexedDB 数据库管理类
 */
class TodoDatabase {
  private db: IDBDatabase | null = null;

  /**
   * 初始化数据库连接
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('数据库打开失败:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建待办事项存储
        if (!db.objectStoreNames.contains(TODOS_STORE)) {
          const todoStore = db.createObjectStore(TODOS_STORE, {
            keyPath: 'id',
          });
          todoStore.createIndex('nextDueDate', 'nextDueDate', {
            unique: false,
          });
          todoStore.createIndex('isRecurring', 'isRecurring', {
            unique: false,
          });
        }

        // 创建已完成事项存储
        if (!db.objectStoreNames.contains(COMPLETED_STORE)) {
          const completedStore = db.createObjectStore(COMPLETED_STORE, {
            keyPath: 'id',
          });
          completedStore.createIndex('completedAt', 'completedAt', {
            unique: false,
          });
        }
      };
    });
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('数据库初始化失败');
    }
    return this.db;
  }

  /**
   * 保存所有待办事项(批量替换)
   */
  async saveTodos(todos: Todo[]): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([TODOS_STORE], 'readwrite');
    const store = transaction.objectStore(TODOS_STORE);

    // 清空现有数据
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    // 添加新数据
    for (const todo of todos) {
      await new Promise<void>((resolve, reject) => {
        const addRequest = store.add(todo);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      });
    }
  }

  /**
   * 加载所有待办事项
   */
  async loadTodos(): Promise<Todo[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction([TODOS_STORE], 'readonly');
    const store = transaction.objectStore(TODOS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 保存所有已完成事项(批量替换)
   */
  async saveCompletedTodos(todos: CompletedTodo[]): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([COMPLETED_STORE], 'readwrite');
    const store = transaction.objectStore(COMPLETED_STORE);

    // 清空现有数据
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    // 添加新数据
    for (const todo of todos) {
      await new Promise<void>((resolve, reject) => {
        const addRequest = store.add(todo);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      });
    }
  }

  /**
   * 加载所有已完成事项
   */
  async loadCompletedTodos(): Promise<CompletedTodo[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction([COMPLETED_STORE], 'readonly');
    const store = transaction.objectStore(COMPLETED_STORE);
    const index = store.index('completedAt');

    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        // 按完成时间倒序排列（最近完成的在前面）
        resolve(result.reverse());
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清空所有数据
   */
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      [TODOS_STORE, COMPLETED_STORE],
      'readwrite',
    );

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore(TODOS_STORE).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore(COMPLETED_STORE).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    ]);
  }
}

// 导出单例实例
export const todoDB = new TodoDatabase();
