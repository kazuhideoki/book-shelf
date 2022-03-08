import { CustomErrorCode } from "../../front/src/server/helper/custom-error-code";
import { CanonicalErrorCodeName } from "../../front/src/server/helper/https-error";
export type CustomError = {
  status: CanonicalErrorCodeName;
  msg: string;
  customErrorCode?: CustomErrorCode;
};
