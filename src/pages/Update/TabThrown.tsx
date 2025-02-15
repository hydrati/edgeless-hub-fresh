import { IconCloseCircle } from "@arco-design/web-react/icon";
import { Button, Space } from "@arco-design/web-react";
import { reportIssue } from "@/pages/Burn/utils";
import { UpdateTabProps } from "./types";

export const TabThrown = ({ next, sharedState }: UpdateTabProps) => {
  const thrownMessage = sharedState.get("thrown_message") ?? "无错误信息";
  return (
    <div className="smt__container">
      <IconCloseCircle
        className="smt__icon"
        style={{ color: "rgb(var(--red-6))" }}
      />
      <div>
        <h1>升级过程中出现了错误</h1>
        <p>{thrownMessage}</p>
      </div>
      <Space>
        <Button onClick={reportIssue}>反馈问题</Button>
        <Button onClick={() => next("Checking")}>重试</Button>
      </Space>
    </div>
  );
};
