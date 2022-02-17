/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthUrl } from "../../../utils/get-auth-url";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const url = getAuthUrl();
    res.json(url);
  }
};
