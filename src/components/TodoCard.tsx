import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Anchor,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import {
  IconCheck,
  IconRepeat,
  IconExternalLink,
  IconClock,
  IconEdit,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import type { Todo } from "../types";
import { isTodoOverdue } from "../utils/utils";
import { ShimmerButton } from "./ui/shimmer-button";

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
            <Group gap="xs" mb={4}>
              <Anchor
                href={todo.link}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                fw={600}
                style={{
                  color: "inherit",
                  textDecoration: isCompleted ? "line-through" : undefined,
                }}
              >
                {todo.title}
                <IconExternalLink
                  size={16}
                  style={{ marginLeft: 4, verticalAlign: "middle" }}
                />
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

          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => onEdit(todo)}
              disabled={isCompleted}
            >
              <IconEdit size={20} />
            </ActionIcon>
            <ShimmerButton
              onClick={() => onComplete(todo.id)}
              className="h-8 px-4 text-sm"
              shimmerColor={isCompleted ? "#4ade80" : "#ffffff"}
              background={
                isCompleted
                  ? "linear-gradient(110deg, #14532d 0%, #166534 100%)"
                  : "rgba(0, 0, 0, 1)"
              }
              disabled={isCompleted}
            >
              <IconCheck size={16} />
              {isCompleted ? "已完成" : "完成"}
            </ShimmerButton>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
