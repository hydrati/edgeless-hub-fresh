interface ObservableBridgeUpdate {
  key: string;
  type: "next" | "error" | "complete";
  value: any;
}

interface BridgeRequest {
  id: number;
  functionName: string;
  args: any;
}

interface BridgeReply {
  id: number;
  payload: any;
}

export { BridgeReply, BridgeRequest, ObservableBridgeUpdate };

export interface Invocation<
  T extends [unknown] | unknown[],
  K extends string = string,
> {
  id: number;
  method: K;
  params: T;
}

export interface RejectedReply<E = any> {
  id: number;
  error: true;
  value: E;
}

export interface FulfilledReply<T> {
  id: number;
  error: false;
  value: T;
}

export type FutureReply<T, E = any> = FulfilledReply<T> | RejectedReply<E>;

export interface ObservableCompleteReply {
  id: number;
  type: 0;
}
export interface ObservableNextReply<T> {
  id: number;
  type: 1;
  value: T;
}

export interface ObservableErrorReply<E> {
  id: number;
  type: 2;
  value: E;
}

export type ObservableReply<T, E> =
  | ObservableNextReply<T>
  | ObservableErrorReply<E>
  | ObservableCompleteReply;
