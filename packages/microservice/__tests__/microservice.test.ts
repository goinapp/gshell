import { IGWorker } from "@gshell/types";
import { Mock, Times } from "moq.ts";
import { IGMicroservice } from "../../types/microservice/index";
import { GMicroservice } from "../src";
import { should } from "chai";

should();

describe("microservice tests", () => {
  let worker1Mock: Mock<IGWorker>;
  let worker2Mock: Mock<IGWorker>;

  let microservice: IGMicroservice;
  let worker1: IGWorker;
  let worker2: IGWorker;

  beforeEach(async () => {
    worker1Mock = new Mock<IGWorker>();
    worker2Mock = new Mock<IGWorker>();

    worker1 = worker1Mock
      .setup((instance) => instance.up())
      .returns(Promise.resolve())
      .setup((instance) => instance.down())
      .returns(Promise.resolve())
      .object();
    worker2 = worker2Mock
      .setup((instance) => instance.up())
      .returns(Promise.resolve())
      .setup((instance) => instance.down())
      .returns(Promise.resolve())
      .object();

    microservice = new GMicroservice({
      w1: worker1,
      worker2,
    });
  });

  it("start should call up() for all of the workers", async () => {
    await microservice.start();

    worker1Mock.verify((instance) => instance.up(), Times.Once());
    worker2Mock.verify((instance) => instance.up(), Times.Once());
  });

  it("stop should call down() for all of the workers", async () => {
    await microservice.stop();

    worker1Mock.verify((instance) => instance.down(), Times.Once());
    worker2Mock.verify((instance) => instance.down(), Times.Once());
  });

  it("service should get the correct worker when it exists", async () => {
    const worker = microservice.service<IGWorker>("w1");

    await worker.up();

    worker1Mock.verify((instance) => instance.up(), Times.Once());
    worker2Mock.verify((instance) => instance.up(), Times.Never());
  });

  it("service should throw an error when the requested worker does not exist", async () => {
    (() => microservice.service<IGWorker>("no-exist"))
      .should.throw();
  });
});
