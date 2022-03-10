import { CustomErrorCode } from "./custom-error-code";
export type CustomError = {
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string;
  customErrorCode?: CustomErrorCode;
};
