import GError from "@gshell/gerror";

export class AmqpConnectionError extends GError {

  constructor() {
    super("[AMQP] Error while connecting to rabbit server.");
    this.name = "RabbitConnectionError";
  }

}
