import { Grid, Typography } from "@material-ui/core";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { DriveFiles } from "../type/google-drive-api.type";
import { useRequest } from "../utils/axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface P {
  code?: string;
}

const Settings: NextPage<P> = () => {
  const request = useRequest();

  const [fileList, setFileList] = useState<DriveFiles | null>(null);

  console.log({ fileList });

  const handleFetchFileList = useCallback(async () => {
    const res = await request<DriveFiles>("GET", `api/drive/files`, {});

    console.log({ res });

    setFileList(res);
  }, []);

  // topページに表示させるものを決め、 表紙をcacheする
  const selectFile = (fileId: string) => {};

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
