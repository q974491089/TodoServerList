import { useState, useEffect, useCallback } from "react";
import {
  MantineProvider,
  Container,
  Title,
  Stack,
  Group,
  LoadingOverlay,
  createTheme,
  Button,
} from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";

import "./App.css";
import dayjs from "dayjs";

import type { Todo, CompletedTodo } from "./types";
import { CreateTodoModal } from "./components/CreateTodoModal";
import { TodoCard } from "./components/TodoCard";
import { EmptyState } from "./components/EmptyState";
import { CompletedList } from "./components/CompletedList";
import { ExportImportButtons } from "./components/ExportImportButtons";
import { Background } from "./components/ui/Background";
import {
  saveTodos,
  loadTodos,
  saveCompletedTodos,
  loadCompletedTodos,
  initDatabase,
} from "./utils/storage";
import {
  generateId,
  createNextRecurringTodo,
  isTodoActive,
} from "./utils/utils";
import { AuroraText } from "./components/ui/aurora-text";

const theme = createTheme({
  defaultRadius: "md",
});

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<CompletedTodo[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      await initDatabase();
      const [loadedTodos, loadedCompleted] = await Promise.all([
        loadTodos(),
        loadCompletedTodos(),
      ]);
      setTodos(loadedTodos);
      setCompletedTodos(loadedCompleted);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load data:", error);
      notifications.show({
        title: "加载失败",
        message: "无法加载待办事项数据",
        color: "red",
      });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // 保存数据
  useEffect(() => {
    if (isLoaded) {
      saveTodos(todos);
    }
  }, [todos, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveCompletedTodos(completedTodos);
    }
  }, [completedTodos, isLoaded]);

  // 创建新待办
  const handleCreateTodo = (values: {
    title: string;
    description: string;
    link: string;
    isRecurring: boolean;
    recurringDays?: number;
  }) => {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: generateId(),
      title: values.title,
      description: values.description,
      link: values.link,
      isRecurring: values.isRecurring,
      recurringDays: values.recurringDays,
      createdAt: now,
      nextDueDate: now,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    notifications.show({
      title: "创建成功",
      message: `待办"${values.title}"已创建`,
      color: "green",
    });
  };

  // 更新待办
  const handleUpdateTodo = (values: {
    title: string;
    description: string;
    link: string;
    isRecurring: boolean;
    recurringDays?: number;
  }) => {
    if (!editingTodo) return;

    const updatedTodo = {
      ...editingTodo,
      ...values,
    };

    setTodos(todos.map((t) => (t.id === editingTodo.id ? updatedTodo : t)));
    setEditingTodo(null);
    setModalOpened(false);

    notifications.show({
      title: "更新成功",
      message: `待办"${values.title}"已更新`,
      color: "green",
    });
  };

  // 完成待办
  const handleCompleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const completedAt = new Date().toISOString();
    const completedTodo: CompletedTodo = {
      ...todo,
      completed: true,
      completedAt,
    };

    // 添加到已完成列表
    setCompletedTodos([completedTodo, ...completedTodos]);

    // 如果是循环任务,创建下一个实例
    if (todo.isRecurring && todo.recurringDays) {
      try {
        const nextTodo = createNextRecurringTodo(todo);
        // 更新原任务为下一个实例
        setTodos(todos.map((t) => (t.id === id ? nextTodo : t)));

        notifications.show({
          title: "任务完成",
          message: `已完成"${todo.title}",下次提醒已自动创建`,
          color: "green",
        });
      } catch (error) {
        console.error("Failed to create next recurring todo:", error);
        setTodos(todos.filter((t) => t.id !== id));
      }
    } else {
      // 非循环任务,直接移除
      setTodos(todos.filter((t) => t.id !== id));

      notifications.show({
        title: "任务完成",
        message: `已完成"${todo.title}"`,
        color: "green",
      });
    }
  };

  // 过滤出应该显示的待办(当前时间范围内的)
  // 包含: 1. 活跃的待办 2. 今天完成的待办
  const activeTodosList = todos.filter(isTodoActive);
  const todayCompletedList = completedTodos.filter((t) =>
    dayjs(t.completedAt).isSame(dayjs(), "day"),
  );

  const displayTodos = [...activeTodosList, ...todayCompletedList].sort(
    (a, b) => {
      // 未完成的排在前面
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // 都在同一状态下，按时间排序
      return dayjs(a.nextDueDate).diff(dayjs(b.nextDueDate));
    },
  );

  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Notifications position="top-right" />
      <Background>
        <LoadingOverlay
          visible={!isLoaded}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Container size="md" py="xl">
          <Stack gap="xl">
            {/* 头部 */}
            <Group justify="space-between" align="center">
              <AuroraText speed={3}>🖥️ 服务器续费管理</AuroraText>
              <Group>
                <ExportImportButtons onImportComplete={loadData} />
                <Button onClick={() => setModalOpened(true)}>
                  <IconPlus size={18} />
                  新建待办
                </Button>
              </Group>
            </Group>

            {/* 待办列表 */}
            <div className="todos-section">
              <Title order={2} size="h3" mb="md">
                📋 待办事项
              </Title>
              {displayTodos.length === 0 ? (
                <EmptyState />
              ) : (
                <Stack gap="md">
                  {displayTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onComplete={handleCompleteTodo}
                      onEdit={(t) => {
                        setEditingTodo(t);
                        setModalOpened(true);
                      }}
                    />
                  ))}
                </Stack>
              )}
            </div>

            {/* 已完成列表 */}
            <CompletedList completedTodos={completedTodos} />
          </Stack>

          {/* 新建/编辑待办模态框 */}
          <CreateTodoModal
            opened={modalOpened}
            onClose={() => {
              setModalOpened(false);
              setEditingTodo(null);
            }}
            onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
            initialValues={editingTodo || undefined}
            title={editingTodo ? "编辑待办" : "新建待办"}
          />
        </Container>
      </Background>
    </MantineProvider>
  );
}

export default App;
