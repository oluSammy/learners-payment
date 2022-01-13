import { ILearner } from "../../src/interfaces/interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: ILearner;
    }
  }
}
