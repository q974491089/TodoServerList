import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Anchor,
  Tooltip,
  ActionIcon,
  Button,
} from "@mantine/core";
import {
  IconCheck,
  IconRepeat,
  IconExternalLink,
  IconClock,
  IconEdit,
  IconBan,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import type { Todo } from "../types";
import { isTodoOverdue } from "../utils/utils";

interface TodoCardProps {
  todo: Todo;
  onComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoCard({ todo, onComplete, onEdit }: TodoCardProps) {
  const isOverdue = isTodoOverdue(todo);
  const dueDate = dayjs(todo.nextDueDate);
  const now = dayjs();
  const daysUntilDue = dueDate.diff(now, "day");
  const isCompleted = todo.completed;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={`todo-card ${isOverdue ? "overdue" : ""} ${
        isCompleted ? "completed" : ""
      }`}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" mb={4} wrap="wrap" align="center">
              <Anchor
                href={todo.link}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                fw={600}
                style={{
                  color: "#fff",
                  textDecoration: isCompleted ? "line-through" : undefined,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {todo.title}
                <IconExternalLink size={16} />
              </Anchor>
              {todo.isRecurring && (
                <Tooltip label={`每 ${todo.recurringDays} 天循环`}>
                  <Badge
                    leftSection={<IconRepeat size={12} />}
                    variant="light"
                    color="blue"
                  >
                    循环
                  </Badge>
                </Tooltip>
              )}
              {isCompleted && (
                <Badge color="green" variant="light">
                  已完成
                </Badge>
              )}
            </Group>

            {todo.description && (
              <Text size="sm" c="dimmed" mb="xs">
                {todo.description}
              </Text>
            )}

            <Group gap="xs">
              <IconClock size={14} />
              <Text size="xs" c={isOverdue ? "red" : "dimmed"}>
                {isCompleted
                  ? `完成于 ${dayjs(todo.completedAt).format(
                      "YYYY-MM-DD HH:mm",
                    )}`
                  : isOverdue
                    ? `已过期 ${Math.abs(daysUntilDue)} 天`
                    : daysUntilDue === 0
                      ? "今天到期"
                      : `还有 ${daysUntilDue} 天到期`}
                {!isCompleted && ` · ${dueDate.format("YYYY-MM-DD HH:mm")}`}
              </Text>
            </Group>
          </div>

          <Group gap="sm">
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="md"
              onClick={() => onEdit(todo)}
              disabled={isCompleted}
              style={{
                color: isCompleted
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(255, 255, 255, 0.85)",
                backgroundColor: isCompleted
                  ? "transparent"
                  : "rgba(255, 255, 255, 0.1)",
                transition: "all 0.2s ease",
              }}
            >
              <IconEdit size={18} />
            </ActionIcon>
            <Tooltip label="今日已完成" disabled={!isCompleted} withArrow>
              <Button
                onClick={() => onComplete(todo.id)}
                variant="gradient"
                gradient={
                  isCompleted
                    ? { from: "gray.6", to: "gray.5", deg: 105 }
                    : { from: "teal", to: "lime", deg: 105 }
                }
                radius="md"
                size="sm"
                leftSection={
                  isCompleted ? <IconBan size={16} /> : <IconCheck size={16} />
                }
                disabled={isCompleted}
                style={{
                  transition: "all 0.2s ease",
                  boxShadow: isCompleted
                    ? "none"
                    : "0 4px 14px 0 rgba(0, 200, 100, 0.3)",
                  opacity: isCompleted ? 0.6 : 1,
                }}
              >
                {isCompleted ? "已完成" : "完成"}
              </Button>
            </Tooltip>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
