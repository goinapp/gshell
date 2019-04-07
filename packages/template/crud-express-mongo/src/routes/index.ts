import { Router, Request, Response } from "express";
import { IGExpressRouter } from "@gshell/express";
import UserManager from "../logic/user.manager";

class UserRouter implements IGExpressRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.route("/")
      .get(this.getUsers)
      .post(this.createUser);
    this.router.route("/:userId")
      .get(this.getUser)
      .patch(this.updateUser)
      .delete(this.deletUser);
  }

  public getRouter(): Router {
    return this.router;
  }

  private getUsers = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const users = await UserManager.getUsers();
      return res.status(200).json({ users })
    } catch(err) {
      return res.status(500).json({ message: "internal server error" });
    }
  };

  private createUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { name, favColor } = req.body;
      if (!name || !favColor) {
        return res.status(400).json({ message: "invalid body" });
      }
      const userId = await UserManager.createUser({ name, favColor });
      return res.status(200).json({ userId });
    } catch(err) {
      return res.status(500).json({ message: "internal server error" });
    }
  };

  private getUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { userId } = req.params;
      const user = await UserManager.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "the user does not exist" });
      }
      return res.status(200).json({ user });
    } catch(err) {
      return res.status(500).json({ message: "internal server error" });
    }
  };

  private updateUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { userId } = req.params;
      const { name, favColor } = req.body;
      if (!name || !favColor) {
        return res.status(400).json({ message: "invalid body" });
      }
      const didUpdate = await UserManager.updateUser(userId, { name, favColor });
      if (!didUpdate) {
        return res.status(404).json({ message: "the user does not exist" });
      }
      return res.status(200).json({ message: "user updated successfully" });
    } catch(err) {
      return res.status(500).json({ message: "internal server error" });
    }
  };

  private deletUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { userId } = req.params;
      const didDelete = await UserManager.deleteUser(userId);
      if (!didDelete) {
        return res.status(404).json({ message: "the user does not exist" });
      }
      return res.status(200).json({ message: "user deleted successfully" });
    } catch(err) {
      return res.status(500).json({ message: "internal server error" });
    }
  };
}

const userRouter = new UserRouter().getRouter();
export { userRouter };
