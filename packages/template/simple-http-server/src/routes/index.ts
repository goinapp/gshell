import { Router, Request, Response } from "express";
import { IGExpressRouter } from "@gshell/express";

// Interface for this?
class HelloRouter implements IGExpressRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.get("/", this.helloWorld);
    this.router.get("/:name", this.helloName);
  }

  public getRouter(): Router {
    return this.router;
  }

  private helloWorld = async (req: Request, res: Response): Promise<Response | void> => {
    console.log("Hello World!");
    return res.status(200).json({ message: "Hello World!" })
  };

  private helloName = async (req: Request, res: Response): Promise<Response | void> => {
    const { name = "unKnown" } = req.params;
    console.log(`Hello ${name}!`);
    return res.status(200).json({ message: `Hello ${name}!` })
  };
}

const helloRouter = new HelloRouter().getRouter();
export { helloRouter };
