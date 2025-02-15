import { ipcMain } from "electron";
import { BridgeReply, BridgeRequest } from "../../../../types/bridge";
import { innerLog } from "../../log";
import { getLocalImageSrc } from "../../utils";

const registry: Record<string, (...args: any) => any> = {
  innerLog,
  getLocalImageSrc,
};


export default function () {
  //创建调用地图
  const callMap = new Map<string, (...args: any) => any>();
  for (let key in registry) {
    callMap.set(key, registry[key]);
  }

  //监听桥事件
  ipcMain.on("_bridge", async (event, req: BridgeRequest) => {
    let entry = callMap.get(req.functionName);
    if (entry == null) {
      const reply = `Error:Fatal:Function "${req.functionName}" unregistered!`;
      // console.log(reply);
      event.reply("_bridge-reply", {
        id: req.id,
        payload: reply,
      });
    } else {
      const payload = await entry(...req.args),
        reply: BridgeReply = {
          id: req.id,
          payload,
        };
      event.reply("_bridge-reply", reply);
    }
  });
}
