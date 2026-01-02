import {
  Accordion,
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Anchor,
} from "@mantine/core";
import { IconCheck, IconExternalLink } from "@tabler/icons-react";
import dayjs from "dayjs";
import type { CompletedTodo } from "../types";

interface CompletedListProps {
  completedTodos: CompletedTodo[];
}

export function CompletedList({ completedTodos }: CompletedListProps) {
  if (completedTodos.length === 0) {
    return null;
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      mt="xl"
      className="todos-section"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Group gap="xs" mb="md">
        <IconCheck size={20} color="white" />
        <Text size="lg" fw={600} c="white">
          已完成 ({completedTodos.length})
        </Text>
      </Group>

      <Accordion
        variant="separated"
        styles={{
          item: {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            "&[data-active]": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
          },
          control: {
            color: "#e2e8f0",
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
          content: {
            color: "#cbd5e1",
          },
          label: {
            color: "#e2e8f0",
          },
        }}
      >
        {completedTodos.map((todo) => (
          <Accordion.Item key={todo.id} value={todo.id}>
            <Accordion.Control>
              <Group justify="space-between">
                <Group gap="md">
                  <Text fw={500}>{todo.title}</Text>
                  <Text size="xs" c="dimmed">
                    完成时间：
                    {dayjs(todo.completedAt).format("YYYY-MM-DD HH:mm")}
                  </Text>
                  <Text size="xs" c="dimmed">
                    创建时间：{dayjs(todo.createdAt).format("YYYY-MM-DD HH:mm")}
                  </Text>
                </Group>
                <Badge color="green" variant="light">
                  已完成
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {todo.description && (
                  <Text size="sm" c="dimmed">
                    {todo.description}
                  </Text>
                )}

                <Anchor
                  href={todo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {todo.link}
                  <IconExternalLink
                    size={14}
                    style={{ marginLeft: 4, verticalAlign: "middle" }}
                  />
                </Anchor>

                <Group gap="xl" mt="xs">
                  <div>
                    <Text size="xs" c="dimmed">
                      完成时间
                    </Text>
                    <Text size="sm">
                      {dayjs(todo.completedAt).format("YYYY-MM-DD HH:mm")}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      创建时间
                    </Text>
                    <Text size="sm">
                      {dayjs(todo.createdAt).format("YYYY-MM-DD HH:mm")}
                    </Text>
                  </div>
                  {todo.isRecurring && (
                    <div>
                      <Text size="xs" c="dimmed">
                        循环周期
                      </Text>
                      <Text size="sm">每 {todo.recurringDays} 天</Text>
                    </div>
                  )}
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  );
}
