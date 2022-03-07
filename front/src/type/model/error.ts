import { CustomErrorCode } from "../../server/helper/custom-error-code";
import { CanonicalErrorCodeName } from "../../server/helper/https-error";
export type CustomError = {
  status: CanonicalErrorCodeName;
  msg: string;
  customErrorCode?: CustomErrorCode;
};
