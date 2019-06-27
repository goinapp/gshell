import { Channel, connect, Connection, Message } from "amqplib";

import { GoinUtils } from "../src";
import { ChannelConnectionError, ConsumerError, RabbitConnectionError } from "../errors";
import { logger } from "./logger";

const MAX_RECONNECTIONS = 10;
const RECONNECTION_TIMEOUT = 1000;
const DEFAULT_PREFETCH = 100;

interface IRabbitOptions {
  uri: string;
  reconnection_timeout?: number;
}

interface IConsumer {
  queue: string;
  consumer: (obj: any) => Promise<void>;
  prefetch?: number;
}

class GoinRabbit {
  private connection?: Connection;
  private channels: { [index: string]: Channel } = {};
  private reconnectCount = 0;
  private isConnected = false;
  private readonly options: IRabbitOptions;
  private readonly consumers: IConsumer[] = [];

  constructor(options: IRabbitOptions) {
    this.options = options;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await connect(this.options.uri);
      this.reconnectCount = 0;
      this.isConnected = true;
      this.connection.on("error", this.onError);
      this.connection.on("close", this.onClose);
      for (const c of this.consumers) {
        await this.initConsumer(c.queue, c.consumer, c.prefetch);
      }
      logger.info("[AMQP] connected to rabbit server");
    } catch (err) {
      await this.reconnect();
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.connection) {
        this.isConnected = false;
        await this.connection.close();
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  public async broadcast(queue: string, message: string): Promise<void> {
    try {
      this.checkConnection();
      const channel: Channel = await this.getChannel(queue);
      await channel.sendToQueue(queue, Buffer.from(message, "utf8"));
    } catch (err) {
      logger.error("[AMQP] There has been an error sending message to queue", { queue, message });
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
      logger.error("[AMQP] There has been an purging queue", { queue });
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
      logger.error("[GSHELL][AMQP] Error consuming rabbit message", { queue, message: err.message });
      throw err;
    }
  }

  private onError = async (err: any): Promise<void> => {
    try {
      logger.error("[AMQP] error event", { message: err.message });
      await this.reconnect();
    } catch (err) {
      logger.error("[AMQP] connection error", { message: err.message });
      process.exit(-1);
    }
  }

  private onClose = async (): Promise<void> => {
    try {
      if (this.isConnected) {
        await this.reconnect();
      }
    } catch (err) {
      logger.error("[AMQP] connection error", { message: err.message });
      process.exit(-1);
    }
  }

  private reconnect = async (): Promise<void> => {
    try {
      logger.info("[AMQP] closing possible active connection before reconnecting");
      await this.close();
    } catch {
      logger.error("[AMQP] closing the possible active connection failed");
    }

    if (this.reconnectCount < MAX_RECONNECTIONS) {
      this.channels = {};
      this.isConnected = false;
      logger.error(`[AMQP] reconnecting in 1s (reconnection_count: ${this.reconnectCount})`);
      await GoinUtils.wait(this.options.reconnection_timeout || RECONNECTION_TIMEOUT);
      ++this.reconnectCount;
      await this.connect();
    } else {
      throw new RabbitConnectionError();
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
      throw new RabbitConnectionError();
    }
  }
}

export {
  IRabbitOptions,
  GoinRabbit,
};
