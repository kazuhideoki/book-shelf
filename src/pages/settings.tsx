import { Grid, Typography } from "@material-ui/core";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { useRecoilValue } from "recoil";
import { driveAuthState } from "../recoil/atom/drive-auth";
import { DriveFiles } from "../type/google-drive-api.type";
import { axiosRequest } from "../utils/axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface P {
  code?: string;
  // authResponse?: AuthResponse;
}

const Settings: NextPage<P> = () => {
  const authResponse = useRecoilValue(driveAuthState);

  const [fileList, setFileList] = useState<DriveFiles | null>(null);

  console.log({ fileList });

  const handleFetchFileList = useCallback(async () => {
    console.log({ frontAccessToken: authResponse?.access_token });

    const res = await axiosRequest<DriveFiles>("GET", `api/drive/files`, {
      params: {
        ...authResponse,
      },
    });

    console.log({ res });

    setFileList(res);
  }, [authResponse]);

  useEffect(() => {
    handleFetchFileList();
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">表示設定</Typography>
      </Grid>
      <Grid item container direction="column">
        {fileList &&
          fileList?.files.map((file, i) => (
            <Grid item key={i}>
              <Typography>{file.name}</Typography>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export default Settings;
