import { Paper, Text, Stack } from '@mantine/core';
import { IconClipboardOff } from '@tabler/icons-react';

export function EmptyState() {
  return (
    <Paper
      p="xl"
      radius="md"
      withBorder
      style={{
        textAlign: 'center',
        background:
          'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
      }}
    >
      <Stack align="center" gap="md">
        <IconClipboardOff size={64} stroke={1.5} style={{ opacity: 0.3 }} />
        <div>
          <Text size="lg" fw={500} mb={4}>
            暂无待办事项
          </Text>
          <Text size="sm" c="dimmed">
            点击上方"新建待办"按钮创建您的第一个服务器续费提醒
          </Text>
        </div>
      </Stack>
    </Paper>
  );
}
