
export type Callback<T> = (arg: T) => void;
export type PromisedCallback<T> = (arg: T) => Promise<any>;

export enum EventTypes {
  USER_RISK_PROFILE_UPDATED = "USER_RISK_PROFILE_UPDATED",
  FIRST_GOAL_CREATION = "FIRST_GOAL_CREATION",
  GOAL_DEPOSIT_REQUEST = "GOAL_DEPOSIT_REQUEST",
  GOAL_DEPOSIT_RECEIVED = "GOAL_DEPOSIT_RECEIVED",
  GOAL_TRADING = "GOAL_TRADING",
  WITHDRAWAL_REQUEST = "WITHDRAWAL_REQUEST",
  WITHDRAWAL_PROCESSED = "WITHDRAWAL_PROCESSED",
  WITHDRAWAL_RECEIVED = "WITHDRAWAL_RECEIVED",
}

export interface IEventConsumer {
  enable(): void;
  disable(): void;
}

export interface IEventManager {
  dispatchAsync<T>(type: EventTypes, arg: T): Promise<void>;
  listen<T>(type: EventTypes, callback: Callback<T>): void;
  listenOnce<T>(type: EventTypes, callback: Callback<T>): void;
  listenAsync<T>(
    type: EventTypes,
    callback: PromisedCallback<T>,
    blocking?: boolean,
  ): void;
  ignore<T>(
    type: EventTypes,
    callback: Callback<T> | PromisedCallback<T>,
  ): void;
  clear(type?: EventTypes): void;
}
