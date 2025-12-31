import type { Todo, CompletedTodo } from '../types';
import { todoDB } from './indexedDB';

/**
 * 导出数据格式
 */
interface ExportData {
  version: string;
  exportDate: string;
  todos: Todo[];
  completedTodos: CompletedTodo[];
}

/**
 * 保存待办事项到 IndexedDB
 */
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  await todoDB.saveTodos(todos);
};

/**
 * 从 IndexedDB 加载待办事项
 */
export const loadTodos = async (): Promise<Todo[]> => {
  return await todoDB.loadTodos();
};

/**
 * 保存已完成事项到 IndexedDB
 */
export const saveCompletedTodos = async (
  todos: CompletedTodo[],
): Promise<void> => {
  await todoDB.saveCompletedTodos(todos);
};

/**
 * 从 IndexedDB 加载已完成事项
 */
export const loadCompletedTodos = async (): Promise<CompletedTodo[]> => {
  return await todoDB.loadCompletedTodos();
};

/**
 * 导出所有数据为 JSON 文件
 */
export const exportToJSON = async (): Promise<void> => {
  try {
    const todos = await todoDB.loadTodos();
    const completedTodos = await todoDB.loadCompletedTodos();

    const exportData: ExportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      todos,
      completedTodos,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出失败:', error);
    throw new Error('导出数据失败');
  }
};

/**
 * 从 JSON 文件导入数据
 */
export const importFromJSON = async (
  file: File,
): Promise<{ todosCount: number; completedCount: number }> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as ExportData;

    // 验证数据格式
    if (!data.todos || !Array.isArray(data.todos)) {
      throw new Error('无效的数据格式:缺少 todos 字段');
    }
    if (!data.completedTodos || !Array.isArray(data.completedTodos)) {
      throw new Error('无效的数据格式:缺少 completedTodos 字段');
    }

    // 导入数据(覆盖现有数据)
    await todoDB.saveTodos(data.todos);
    await todoDB.saveCompletedTodos(data.completedTodos);

    return {
      todosCount: data.todos.length,
      completedCount: data.completedTodos.length,
    };
  } catch (error) {
    console.error('导入失败:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('导入数据失败');
  }
};

/**
 * 初始化数据库
 */
export const initDatabase = async (): Promise<void> => {
  await todoDB.init();
};
