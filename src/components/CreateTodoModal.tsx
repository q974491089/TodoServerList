import {
  Modal,
  TextInput,
  Textarea,
  Switch,
  NumberInput,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';

interface CreateTodoModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    link: string;
    isRecurring: boolean;
    recurringDays?: number;
  }) => void;
  initialValues?: {
    title: string;
    description: string;
    link: string;
    isRecurring: boolean;
    recurringDays?: number;
  };
  title?: string;
}

export function CreateTodoModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  title,
}: CreateTodoModalProps) {
  const [isRecurring, setIsRecurring] = useState(
    initialValues?.isRecurring || false,
  );

  const form = useForm({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      link: initialValues?.link || '',
      recurringDays: initialValues?.recurringDays || 1,
    },
    validate: {
      title: (value) => (value.trim().length === 0 ? '请输入标题' : null),
      link: (value) => {
        if (value.trim().length === 0) return '请输入链接';
        try {
          new URL(value);
          return null;
        } catch {
          return '请输入有效的 URL';
        }
      },
      recurringDays: (value) =>
        isRecurring && (!value || value < 1) ? '循环天数必须大于 0' : null,
    },
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setValues({
        title: initialValues.title,
        description: initialValues.description,
        link: initialValues.link,
        recurringDays: initialValues.recurringDays || 1,
      });
      setIsRecurring(initialValues.isRecurring);
    } else {
      form.reset();
      setIsRecurring(false);
    }
  }, [initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values: typeof form.values) => {
    onSubmit({
      ...values,
      isRecurring,
      recurringDays: isRecurring ? values.recurringDays : undefined,
    });
    if (!initialValues) {
      form.reset();
      setIsRecurring(false);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title || '新建服务器续费待办'}
      size="lg"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="标题"
            placeholder="例如: 阿里云服务器续费"
            required
            {...form.getInputProps('title')}
          />

          <Textarea
            label="描述"
            placeholder="添加备注信息..."
            minRows={3}
            {...form.getInputProps('description')}
          />

          <TextInput
            label="续费链接"
            placeholder="https://example.com/renew"
            required
            {...form.getInputProps('link')}
          />

          <Switch
            label="设置为循环待办"
            description="自动按周期生成续费提醒"
            checked={isRecurring}
            onChange={(event) => setIsRecurring(event.currentTarget.checked)}
          />

          {isRecurring && (
            <NumberInput
              label="循环天数"
              placeholder="输入天数"
              min={1}
              required
              {...form.getInputProps('recurringDays')}
            />
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">创建</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
