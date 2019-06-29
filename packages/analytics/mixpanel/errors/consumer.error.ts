import GError from "@gshell/gerror";

export class ConsumerError extends GError {

  constructor(msg: string, queue: string) {
    super(`[AMQP] Error while consuming ${msg} from queue ${queue}`);
    this.name = "ConsumerError";
  }

}
