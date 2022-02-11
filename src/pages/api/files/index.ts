import type { NextApiRequest, NextApiResponse } from "next";
import { testGoogleApi } from "../../../server/google-drive.service";

export default (req: NextApiRequest, res: NextApiResponse) => {
  testGoogleApi();
  res.status(200).json({ name: "John Doe" });
};
