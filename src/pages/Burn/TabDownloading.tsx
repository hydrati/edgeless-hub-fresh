import { IconCloudDownload } from "@arco-design/web-react/icon";
import { Button, Space } from "@arco-design/web-react";
import { BurnTabProps } from "./types";
import { useState } from "react";
import {
  NaiveProgressBar,
  NaiveProgressBarTask,
} from "@/components/molecules/NaiveProgressBar";
import { formatSize } from "@/utils/formatter";

export const TabDownloading = ({ next, sharedState }: BurnTabProps) => {
  const emptyTask: NaiveProgressBarTask = {
    percent: 0,
    totalSize: 0,
    fileName: "等待中...",
  };
  const [taskImage, setTaskImage] = useState<NaiveProgressBarTask>({
      percent: 14,
      totalSize: 809 * 1024 * 1024,
      fileName: "Edgeless_Beta_4.1.0.iso",
    }),
    [taskVentoy, setTaskVentoy] = useState<NaiveProgressBarTask>({
      percent: 45,
      totalSize: 15597 * 1024,
      fileName: "ventoy-1.0.79-windows.zip",
    }),
    [taskVentoyPlugin, setTaskVentoyPlugin] = useState<NaiveProgressBarTask>({
      percent: 90,
      totalSize: 2868 * 1024,
      fileName: "ventoy_wimboot.img",
    });
  const totalSize = formatSize(
    taskImage.totalSize + taskVentoy.totalSize + taskVentoyPlugin.totalSize
  );

  return (
    <div className="smt__container">
      <IconCloudDownload className="smt__icon" />
      <div>
        <h1>我们需要下载一些必要的依赖文件</h1>
        <p>{`共计 ${totalSize}，请保持网络连接稳定且可靠`}</p>
      </div>
      <Space direction="vertical" style={{ width: "80%" }}>
        <NaiveProgressBar info={taskImage} colorful="blue" />
        <NaiveProgressBar info={taskVentoy} colorful="blue" />
        <NaiveProgressBar info={taskVentoyPlugin} colorful="blue" />
      </Space>
      <Button onClick={() => next()}>next</Button>
    </div>
  );
};
