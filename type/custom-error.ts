import { CustomErrorCode } from "../server/src/0-base/custom-error-code";
export type CustomError = {
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string;
  customErrorCode?: CustomErrorCode;
};
