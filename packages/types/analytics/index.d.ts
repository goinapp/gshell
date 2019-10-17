import { IGWorker } from "../core/worker";

export interface IGAnalytics extends IGWorker {
  track(data: ITrackData): Promise<void>;
  identify(data: IIdentifyData): Promise<void>;
}

export interface ITrackData {
  userId: string,
  event: string,
  properties: {
    [key: string]: any,
  }
}

export interface IIdentifyData {
  userId: string,
  traits: {
    [key: string]: any,
  }
}

export * from "./segment";
