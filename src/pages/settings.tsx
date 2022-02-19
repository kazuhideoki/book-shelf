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
import { ServerPath } from "../server/helper/const";
import { ListDriveFiles } from "../type/api/google-drive-api.type";
import { DriveFile, DriveFiles } from "../type/model/google-drive.type";
import { useRequest } from "../utils/axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface P {
  code?: string;
}

const Settings: NextPage<P> = () => {
  const request = useRequest();

  const [values, setValues] = useState<{
    folders: {
      list: DriveFile[];
      pageToken: string;
    } | null;
    files: {
      list: DriveFile[];
      pageToken: string;
    } | null;
    selectedFolders: DriveFile[];
    selectedFiles: DriveFile[];
  }>({
    folders: null,
    files: null,
    selectedFolders: [],
    selectedFiles: [],
  });

  console.log({ values });

  const handleFetchFolderList = useCallback(async () => {
    const res = await request<DriveFiles, ListDriveFiles>(
      "GET",
      ServerPath.files,
      {
        params: {
          q: "mimeType = 'application/vnd.google-apps.folder'",
          pageToken: values.folders?.pageToken,
        },
      }
    );

    console.log({ res });

    setValues({
      ...values,
      folders: {
        list: values.folders?.list
          ? [...values.folders?.list, ...res.files]
          : res.files,
        pageToken: res.nextPageToken,
      },
    });
  }, [values]);

  const handleFetchFileList = useCallback(async () => {
    const res = await request<DriveFiles, ListDriveFiles>(
      "GET",
      ServerPath.files,
      {
        params: {
          q: "mimeType = 'application/pdf'",
          pageToken: values.files?.pageToken,
        },
      }
    );

    console.log({ res });

    setValues({
      ...values,
      files: {
        list: values.files?.list
          ? [...values.files?.list, ...res.files]
          : res.files,
        pageToken: res.nextPageToken,
      },
    });
  }, [values]);

  useEffect(() => {
    handleFetchFolderList();
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">表示設定</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5">フォルダー設定</Typography>
      </Grid>
      <Button onClick={handleFetchFolderList}>Fetch more!</Button>
      <Grid item container direction="column">
        <FormGroup>
          {values.folders &&
            values.folders.list.map((file, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox />}
                onClick={(e) =>
                  setValues({
                    ...values,
                    selectedFiles: (e.target as any).checked
                      ? [...values.selectedFiles, file]
                      : values.selectedFiles.filter((e) => e.id !== file.id),
                  })
                }
                label={file.name}
              />
            ))}
        </FormGroup>
      </Grid>
      <Typography variant="h5">ファイル選択</Typography>
      <Button onClick={handleFetchFileList}>Fetch file!</Button>
      <Grid item></Grid>
      <Grid item container direction="column">
        <FormGroup>
          {values.files &&
            values.files.list.map((file, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox />}
                onClick={(e) =>
                  setValues({
                    ...values,
                    selectedFolders: (e.target as any).checked
                      ? [...values.selectedFolders, file]
                      : values.selectedFolders.filter((e) => e.id !== file.id),
                  })
                }
                label={file.name}
              />
            ))}
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default Settings;
