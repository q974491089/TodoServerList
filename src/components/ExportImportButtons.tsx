import { Button, Group, FileButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDownload, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { exportToJSON, importFromJSON } from "../utils/storage";

interface ExportImportButtonsProps {
  onImportComplete: () => void;
}

export const ExportImportButtons = ({
  onImportComplete,
}: ExportImportButtonsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToJSON();
      notifications.show({
        title: "导出成功",
        message: "数据已导出为 JSON 文件",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "导出失败",
        message: error instanceof Error ? error.message : "导出数据时发生错误",
        color: "red",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;

    try {
      setIsImporting(true);
      const result = await importFromJSON(file);
      notifications.show({
        title: "导入成功",
        message: `已导入 ${result.todosCount} 个待办事项和 ${result.completedCount} 个已完成事项`,
        color: "green",
      });
      onImportComplete();
    } catch (error) {
      notifications.show({
        title: "导入失败",
        message: error instanceof Error ? error.message : "导入数据时发生错误",
        color: "red",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Group gap="sm">
      <Button
        leftSection={
          <IconDownload
            size={18}
            style={{
              color: "#fff",
            }}
          />
        }
        onClick={handleExport}
        loading={isExporting}
        variant="outline"
        radius="10"
        color="#fff"
        aria-label="Settings"
      >
        导出
      </Button>
      <FileButton onChange={handleImport} accept="application/json">
        {(props) => (
          <Button
            {...props}
            variant="outline"
            leftSection={<IconUpload size={18} />}
            loading={isImporting}
            gradient={{ from: "cyan", to: "gray", deg: 178 }}
            color="#fff"
          >
            导入
          </Button>
        )}
      </FileButton>
    </Group>
  );
};
