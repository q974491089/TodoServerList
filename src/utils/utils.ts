import dayjs from 'dayjs';
import type { Todo } from '../types';

/**
 * 计算下次到期时间
 * @param baseDate 基准日期
 * @param recurringDays 循环天数
 */
export const calculateNextDueDate = (
  baseDate: string,
  recurringDays: number,
): string => {
  return dayjs(baseDate).add(recurringDays, 'day').startOf('day').toISOString();
};

/**
 * 判断待办是否在当前时间范围内(是否应该显示)
 * @param todo 待办项
 */
export const isTodoActive = (todo: Todo): boolean => {
  const now = dayjs();
  const dueDate = dayjs(todo.nextDueDate);

  // 如果是循环任务,只要到期时间已到或已过期就显示
  if (todo.isRecurring) {
    return dueDate.isBefore(now) || dueDate.isSame(now, 'day');
  }

  // 非循环任务,只要创建了就显示
  return true;
};

/**
 * 判断待办是否已过期
 * @param todo 待办项
 */
export const isTodoOverdue = (todo: Todo): boolean => {
  const now = dayjs();
  const dueDate = dayjs(todo.nextDueDate);
  return dueDate.isBefore(now, 'day');
};

/**
 * 为循环任务创建下一个实例
 * @param completedTodo 已完成的待办
 */
export const createNextRecurringTodo = (completedTodo: Todo): Todo => {
  if (!completedTodo.isRecurring || !completedTodo.recurringDays) {
    throw new Error('Only recurring todos can generate next instance');
  }

  const now = new Date().toISOString();
  const nextDueDate = calculateNextDueDate(now, completedTodo.recurringDays);

  return {
    ...completedTodo,
    id: `${completedTodo.id}-${Date.now()}`, // 生成新的唯一ID
    completed: false,
    completedAt: undefined,
    nextDueDate,
  };
};

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
