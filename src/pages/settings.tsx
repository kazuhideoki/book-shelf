import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@material-ui/core";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { ListDriveFiles } from "../type/api/google-drive-api.type";
import { DriveFile, DriveFiles } from "../type/model/google-drive.type";
import { useRequest } from "../utils/axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface P {
  code?: string;
}

const Settings: NextPage<P> = () => {
  const request = useRequest();

  const [folderList, setFolderList] = useState<{
    files: DriveFile[];
    pageToken: string;
  } | null>(null);

  console.log({ fileList: folderList });

  const handleFetchFolderList = useCallback(async () => {
    const res = await request<DriveFiles, ListDriveFiles>("GET", `api/files`, {
      params: {
        q: "mimeType = 'application/vnd.google-apps.folder'",
        pageToken: folderList?.pageToken,
      },
    });

    console.log({ res });

    setFolderList({
      files: folderList?.files
        ? [...folderList?.files, ...res.files]
        : res.files,
      pageToken: res.nextPageToken,
    });
  }, [folderList]);

  // topページに表示させるものを決め、 表紙をcacheする
  const selectFile = (fileId: string) => {};

  useEffect(() => {
    handleFetchFolderList();
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">表示設定</Typography>
      </Grid>
      <Button onClick={handleFetchFolderList}>Fetch Again</Button>
      <Grid item container direction="column">
        <FormGroup>
          {folderList &&
            folderList?.files.map((file, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox />}
                label={file.name}
              />
            ))}
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default Settings;
