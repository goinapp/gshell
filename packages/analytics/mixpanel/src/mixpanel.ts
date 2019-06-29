import { IUserEventOptions, IEventOptions, userUpdateOperation, updateOperation, instanceOfSet, instanceOfSetOnce, instanceOfAdd, instanceOfAppend, instanceOfDelete, instanceOfRemove, instanceOfUnion, instanceOfUnset } from "../models/mixpanel.models";
import * as rp from "request-promise";
import { IGAnalytics } from "@gshell/types";

const eventUrl = "https://api.mixpanel.com/track/?data=";
const oldEventUrl = "https://api.mixpanel.com/import/?data=";
const pupdateUrl = "https://api.mixpanel.com/engage/?data=";

export interface IGMixpanelOptions {
  token: string;
}

export class GMixpanel implements IGAnalytics {
  private readonly token: string;

  constructor(options: IGMixpanelOptions) {
    this.token = options.token;
  }

  public async up() {
    // No init
  }

  public async down() {
    // No close
  }

  public async trackEvent(userEvent: IUserEventOptions, old: boolean) {
    const event = this.createRequestEvent(userEvent);

    let request;
    if (old) {
      request = oldEventUrl + this.toBase64(event); // PENDING
    } else {
      request = eventUrl + this.toBase64(event);
    }

    const options = {
      method: "POST",
      uri: request,
    };
    await rp(options);
  }

  public async trackBatchEvents(userEvents: IUserEventOptions[]) {
    const eventList: IEventOptions[] = [];

    for (const event of userEvents) {
      eventList.push(this.createRequestEvent(event));
    }

    const request = eventUrl + this.toBase64(eventList);
    const options = {
      method: "POST",
      uri: request,
    };
    await rp(options);
  }

  public async trackProfileUpdate(userUpdate: userUpdateOperation) {
    const update = this.createRequestUpdate(userUpdate);

    const request = pupdateUrl + this.toBase64(update);

    const options = {
      method: "POST",
      uri: request,
    };
    await rp(options);
  }

  public async trackBatchUpdates(userUpdates: userUpdateOperation[]) {
    const updateList: updateOperation[] = [];

    for (const update of userUpdates) {
      const updateItem = this.createRequestUpdate(update);
      if (updateItem) {
        updateList.push(updateItem);
      }
    }

    const request = pupdateUrl + this.toBase64(updateList);
    const options = {
      method: "POST",
      uri: request,
    };

    await rp(options);
  }

  private createRequestEvent(userEvent: IUserEventOptions) {
    const event: IEventOptions = {
      event: userEvent.event,
      properties: {
        token: this.token,
        distinct_id: userEvent.properties.distinct_id,
        ... userEvent.properties.extra,
      },
    };

    if (userEvent.properties.ip) {
      event.properties.ip = userEvent.properties.ip;
    }

    if (userEvent.properties.time) {
      event.properties.time = userEvent.properties.time;
    }

    return event;
  }

  private createRequestUpdate(userUpdate: userUpdateOperation) {
    let event: updateOperation | undefined;

    if (instanceOfSet(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $set: userUpdate.set,
      };
    } else if (instanceOfSetOnce(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $set_once: userUpdate.set_once,
      };
    } else if (instanceOfAdd(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $add: userUpdate.add,
      };
    } else if (instanceOfAppend(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $append: userUpdate.append,
      };
    } else if (instanceOfDelete(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $delete: userUpdate.delete,
      };
    } else if (instanceOfRemove(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $remove: userUpdate.remove,
      };
    } else if (instanceOfUnion(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $union: userUpdate.union,
      };
    } else if (instanceOfUnset(userUpdate)) {
      event = {
        $token: this.token,
        $distinct_id: userUpdate.distinct_id,
        $unset: userUpdate.unset,
      };
    }

    if (event !== undefined) {
      if (userUpdate.ip) {
        event.$ip = userUpdate.ip;
      }

      if (userUpdate.time) {
        event.$time = userUpdate.time;
      }

      if (userUpdate.ignore_time) {
        event.$ignore_time = userUpdate.ignore_time;
      }
    }

    return event;
  }

  private toBase64(event: any) {
    return Buffer.from(JSON.stringify(event)).toString("base64");
  }
}
