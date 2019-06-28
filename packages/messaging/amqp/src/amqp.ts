import { Channel, connect, Connection, Message } from "amqplib";
import { AmqpConnectionError } from "../errors/amqp.connection.error";
import { ConsumerError } from "../errors/consumer.error";
import { ChannelConnectionError } from "../errors/channel.connection.error";
import { IGLogger, IConsumer, IGMessageBroker, IGMessageBrokerOptions } from "@gshell/types";

const MAX_RECONNECTIONS = 10;
const RECONNECTION_TIMEOUT = 1000;
const DEFAULT_PREFETCH = 100;

const wait = (delay: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

export class GAmqp implements IGMessageBroker {
  private connection?: Connection;
  private channels: { [index: string]: Channel } = {};
  private reconnectCount = 0;
  private readonly logger: IGLogger;
  private isConnected = false;
  private readonly options: IGMessageBrokerOptions;
  private readonly consumers: IConsumer[] = [];

  constructor(options: IGMessageBrokerOptions) {
    this.options = options;
  }

  public async up(): Promise<void> {
    try {
      this.connection = await connect(this.options.uri);
      this.reconnectCount = 0;
      this.isConnected = true;
      this.connection.on("error", this.onError);
      this.connection.on("close", this.onClose);
      for (const c of this.consumers) {
        await this.initConsumer(c.queue, c.consumer, c.prefetch);
      }
      this.logger.info("[AMQP] connected to rabbit server");
    } catch (err) {
      await this.reconnect();
    }
  }

  public async down(): Promise<void> {
    try {
      if (this.connection) {
        this.isConnected = false;
        await this.connection.close();
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async broadcast(queue: string, message: string): Promise<void> {
    try {
      this.checkConnection();
      const channel: Channel = await this.getChannel(queue);
      await channel.sendToQueue(queue, Buffer.from(message, "utf8"));
    } catch (err) {
      this.logger.error("[AMQP] There has been an error sending message to queue", { queue, message });
      throw err;
    }
  }

  public consume(queue: string, consumer: (obj: any) => Promise<void>, prefetch?: number) {
    this.consumers.push({
      queue,
      consumer,
      prefetch,
    });
    if (this.isConnected) {
      this.initConsumer(queue, consumer, prefetch);
    }
  }

  public async purge(queue: string): Promise<void> {
    try {
      this.checkConnection();
      const channel: Channel = await this.getChannel(queue);
      await channel.purgeQueue(queue);
    } catch (err) {
      this.logger.error("[AMQP] There has been an purging queue", { queue });
      throw err;
    }
  }

  private async initConsumer(queue: string, consumer: (obj: any) => Promise<void>, prefetch?: number): Promise<void> {
    try {
      this.checkConnection();
      const channel: Channel = await this.getChannel(queue);
      await channel.prefetch(prefetch ? prefetch : DEFAULT_PREFETCH);
      await channel.consume(queue, async (msg: Message | null) => {
        if (msg === null) {
          throw new ChannelConnectionError(queue);
        }
        const obj: any = JSON.parse(msg.content.toString());
        try {
          await consumer(obj);
        } catch (err) {
          throw new ConsumerError(msg.content.toString(), queue);
        } finally {
          channel.ack(msg);
        }
      });
    } catch (err) {
      this.logger.error("[AMQP] Error consuming rabbit message", { queue, message: err.message });
      throw err;
    }
  }

  private onError = async (err: any): Promise<void> => {
    try {
      this.logger.error("[AMQP] error event", { message: err.message });
      await this.reconnect();
    } catch (err) {
      this.logger.error("[AMQP] connection error", { message: err.message });
      process.exit(-1);
    }
  }

  private onClose = async (): Promise<void> => {
    try {
      if (this.isConnected) {
        await this.reconnect();
      }
    } catch (err) {
      this.logger.error("[AMQP] connection error", { message: err.message });
      process.exit(-1);
    }
  }

  private reconnect = async (): Promise<void> => {
    try {
      this.logger.info("[AMQP] closing possible active connection before reconnecting");
      await this.down();
    } catch {
      this.logger.error("[AMQP] closing the possible active connection failed");
    }

    if (this.reconnectCount < MAX_RECONNECTIONS) {
      this.channels = {};
      this.isConnected = false;
      this.logger.error(`[AMQP] reconnecting in 1s (reconnection_count: ${this.reconnectCount})`);
      await wait(this.options.reconnection_timeout || RECONNECTION_TIMEOUT);
      ++this.reconnectCount;
      await this.up();
    } else {
      throw new AmqpConnectionError();
    }
  }

  private async getChannel(queue: string): Promise<Channel> {
    try {
      if (this.connection && this.channels[queue] === undefined) {
        this.channels[queue] = await this.connection.createChannel();
        this.channels[queue].assertQueue(queue);
      }
      return this.channels[queue];
    } catch (err) {
      throw new ChannelConnectionError(queue);
    }
  }

  private checkConnection(): void {
    if (!this.isConnected) {
      throw new AmqpConnectionError();
    }
  }
}
