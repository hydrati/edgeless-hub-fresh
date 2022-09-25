import { FutureReply } from "../../../../types/bridge";
import { IpcMain, IpcMainEvent } from "electron";

export async function toReply<T, E = any>(
  id: number,
  promise: Promise<T>,
): Promise<FutureReply<T, E>> {
  try {
    const value = await promise;
    return { id, error: false, value };
  } catch (err: any) {
    return { id, error: true, value: err };
  }
}

export type FutureMethod<T extends [unknown] | unknown[], R, E> = (
  id: number,
  ...args: T
) => Promise<FutureReply<R, E>>;

export type Method<T extends [unknown] | unknown[], R> = (
  ...args: T
) => Promise<R>;

export type MethodStore = Map<string, FutureMethod<any[], any, any>>;

const kInstance = Symbol("kInstance");

export class InvokeBridgeMain {
  static [kInstance]: InvokeBridgeMain = new InvokeBridgeMain();

  private constructor() {}

  protected _methods: MethodStore = new Map();

  setup(ipc: IpcMain) {
    ipc.on("bridge:invoke_call", this._handleIpc.bind(this));
  }

  protected async _call(
    id: number,
    method: string,
    args: any[],
  ): Promise<FutureReply<any, any>> {
    if (!this.has(method)) {
      return toReply(id, Promise.reject<any>("error: not found method"));
    }

    const fn = this._methods.get(method);
    try {
      const value = await fn(id, ...args);
      return value;
    } catch (err: any) {
      return toReply(id, Promise.reject<any>(err?.toString() ?? err));
    }
  }

  protected async _handleIpc(event: IpcMainEvent, msg: any) {
    if (
      typeof msg != "object" || typeof msg.id != "number" ||
      typeof msg.method != "string" || !Array.isArray(msg.params)
    ) {
      return;
    }

    const reply = await this._call(msg.id, msg.method, msg.params);
    event.sender.send("bridge:invoke_reply", reply);
  }

  handleRaw<T extends [unknown] | unknown[], R, E>(
    method: string,
    handler: FutureMethod<T, R, E>,
  ): this {
    this._methods.set(method, handler);
    return this;
  }

  handle<T extends [unknown] | unknown[], R>(
    method: string,
    handler: Method<T, R>,
  ): this {
    this.handleRaw<T, R, any>(
      method,
      (id, ...args) => toReply(id, handler(...args)),
    );
    return this;
  }

  has(method: string) {
    return this._methods.has(method);
  }

  remove(method: string) {
    return this._methods.delete(method);
  }
}

export const invokeBridge = InvokeBridgeMain[kInstance];

export { FutureReply };
