import { IGSegmentOptions, IGAnalytics, ITrackData, IIdentifyData,  } from "@gshell/types";
import Analytics from "analytics-node";

export class GMixpanel implements IGAnalytics {
  private analytics: Analytics;

  constructor(options: IGSegmentOptions) {
    this.analytics = new Analytics(options.writeKey);
  }

  public async track(data: ITrackData) {
    await this.analytics.track(data);
  }

  public async identify(data: IIdentifyData) {
    await this.analytics.identify(data);
  }

  public async up() {
    return;
  }

  public async down() {
    return;
  }
}
