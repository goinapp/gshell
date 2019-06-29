export interface IUserEventOptions {
  event: string;
  properties: {
    distinct_id: string;
    time?: number;
    ip?: string;
    extra?: object;
  };
}

export interface IEventOptions {
  event: string;
  properties: {
    token: string;
    distinct_id: string;
    time?: number;
    ip?: string;
    extra?: object;
  };
}

export interface IUserSetOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  set: { [key: string]: any};
}

export function instanceOfSet(object: any): object is IUserSetOptions {
  return "set" in object;
}

export interface IUserSetOnceOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  set_once: { [key: string]: any};
}

export function instanceOfSetOnce(object: any): object is IUserSetOnceOptions {
  return "set_once" in object;
}

export interface IUserAddOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  add: { [key: string]: any};
}

export function instanceOfAdd(object: any): object is IUserAddOptions {
  return "add" in object;
}

export interface IUserAppendOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  append: { [key: string]: any};
}

export function instanceOfAppend(object: any): object is IUserAppendOptions {
  return "append" in object;
}

export interface IUserUnionOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  union: { [key: string]: any};
}

export function instanceOfUnion(object: any): object is IUserUnionOptions {
  return "union" in object;
}

export interface IUserRemoveOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  remove: { [key: string]: any};
}

export function instanceOfRemove(object: any): object is IUserRemoveOptions {
  return "remove" in object;
}

export interface IUserUnsetOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  unset: string[];
}

export function instanceOfUnset(object: any): object is IUserUnsetOptions {
  return "unset" in object;
}

export interface IUserDeleteOptions {
  distinct_id: string;
  time?: number;
  ip?: string;
  ignore_time?: boolean;
  delete: any;
}

export function instanceOfDelete(object: any): object is IUserDeleteOptions {
  return "delete" in object;
}

export interface IUpdateSetOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $set: { [key: string]: any};
}

export interface IUpdateSetOnceOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $set_once: { [key: string]: any};
}

export interface IUpdateAddOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $add: { [key: string]: any};
}

export interface IUpdateAppendOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $append: { [key: string]: any};
}

export interface IUpdateUnionOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $union: { [key: string]: any};
}

export interface IUpdateRemoveOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $remove: { [key: string]: any};
}

export interface IUpdateUnsetOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $unset: string[];
}

export interface IUpdateDeleteOptions {
  $token: string;
  $distinct_id: string;
  $time?: number;
  $ip?: string;
  $ignore_time?: boolean;
  $delete: any;
}

export type updateOperation = IUpdateSetOptions | IUpdateSetOnceOptions | IUpdateAddOptions | IUpdateAppendOptions | IUpdateDeleteOptions | IUpdateRemoveOptions | IUpdateUnionOptions | IUpdateUnsetOptions;
export type userUpdateOperation = IUserSetOptions | IUserSetOnceOptions | IUserAddOptions | IUserAppendOptions |  IUserDeleteOptions | IUserRemoveOptions | IUserUnionOptions | IUserUnsetOptions;

export interface IMixpanelOptions {
  token: string;
}

export const eventUrl = "https://api.mixpanel.com/track/?data=";
export const oldEventUrl = "https://api.mixpanel.com/import/?data=";
export const pupdateUrl = "https://api.mixpanel.com/engage/?data=";
