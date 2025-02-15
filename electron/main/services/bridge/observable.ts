import { Observable } from "rxjs";
import { ipcMain } from "electron";
import { log } from "../../log";
import { getObservableConfig } from "../config";
import { Ok, Result } from "ts-results";
import { ObservableBridgeUpdate } from "../../../../types/bridge";

const register: Record<string, Observable<any>> = {};

async function init(): Promise<Result<null, string>> {
  const configRes = await getObservableConfig();
  if (configRes.err) return configRes;
  register.config = configRes.unwrap();

  return new Ok(null);
}

export default async function (
  webContents: any
): Promise<Result<null, string>> {
  //初始化需要异步获取的 register keys
  const initRes = await init();
  if (initRes.err) return initRes;

  // 创建用于保存最后一次发送响应对象的 map
  // 此 bridge 的行为接近 BehaviorObservable
  const recentMap = new Map<string, ObservableBridgeUpdate | null>();

  //代理订阅全部 Observable 并将其更新发送到 ipc 上
  for (const key in register) {
    recentMap.set(key, null);

    const update = (type: ObservableBridgeUpdate["type"], value: any) => {
      const res: ObservableBridgeUpdate = {
        key,
        type,
        value,
      };
      recentMap.set(key, res);
      webContents.send("_bridge_observable-update", res);
    };

    const observable = register[key];
    observable.subscribe({
      next: (value) => {
        update("next", value);
      },
      error: (err) => {
        update("error", err);
      },
      complete: () => {
        update("complete", null);
      },
    });
  }

  //监听来自渲染进程的监听请求并发送 recent 值
  ipcMain.on("_bridge_observable-subscribe", (event, key: string) => {
    if (!recentMap.has(key)) {
      log(`Error:Fatal:Try to subscribe to a unknown observable : ${key}`);
      return;
    } else {
      const recent = recentMap.get(key);
      if (recent != null) {
        event.reply("_bridge_observable-update", recent);
      }
    }
  });

  return new Ok(null);
}
