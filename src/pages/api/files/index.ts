/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("api/files");

  if (req.method === "GET") {
    const { access_token } = req.query;

    console.log({ access_token });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?access_token=${access_token}`
    );

    const json = await response.json();

    console.log({ DirveRes: response });

    console.log({ files: json as any });
    return res.status(200).json(json);
  }
};
