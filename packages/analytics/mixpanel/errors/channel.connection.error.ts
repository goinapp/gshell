import GError from '@gshell/gerror';

export class ChannelConnectionError extends GError {

  constructor(queue: string) {
    super(`[AMQP] Channel connection error on ${queue}`);
    this.name = "ChannelConnectionError";
  }

}
