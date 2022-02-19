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
    folderData: {
      folders: (DriveFile & { files?: DriveFile[]; pageToken?: string })[];
      pageToken: string;
    } | null;
    selectedFiles: DriveFile[];
  }>({
    folderData: null,
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
          pageToken: values.folderData?.pageToken,
        },
      }
    );

    console.log({ res });

    setValues({
      ...values,
      folderData: {
        folders: values.folderData?.folders
          ? [...values.folderData?.folders, ...res.files]
          : res.files,
        pageToken: res.nextPageToken,
      },
    });
  }, [values]);

  const handleFetchFileList = useCallback(
    async (folder: DriveFile) => {
      const targetFolder = values.folderData?.folders.find(
        (e) => e.id === folder.id
      )!;

      console.log({ targetFolder });

      const res = await request<DriveFiles, ListDriveFiles>(
        "GET",
        ServerPath.files,
        {
          params: {
            q: `mimeType = 'application/pdf' and '${folder.id}' in parents`,
            pageToken: targetFolder?.pageToken,
          },
        }
      );

      console.log({ res });

      const files = targetFolder?.files
        ? [...targetFolder.files, ...res.files]
        : res.files;

      // folderのfileを追加
      const updatedFolders: (DriveFile & {
        files?: DriveFile[];
        pageToken?: string;
      })[] = values.folderData?.folders.map((folder) => {
        if (folder.id === targetFolder.id) {
          return {
            ...folder,
            files: files,
            pageToken: res.nextPageToken,
          };
        }
        return folder;
      })!;

      setValues({
        ...values,
        folderData: {
          ...values.folderData!,
          folders: updatedFolders,
        },
      });
    },
    [values]
  );

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
        {values.folderData &&
          values.folderData.folders.map((folder, i) => {
            const files = values.folderData?.folders.find(
              (e) => e.id === folder.id
            )?.files;
            return (
              <Grid item key={i}>
                <Button onClick={() => handleFetchFileList(folder)}>
                  {folder.name} Fetch file!
                </Button>
                {files?.length && (
                  <>
                    <Typography variant="h5">ファイル選択</Typography>
                    <Grid item container direction="column">
                      <FormGroup>
                        {files?.map((file, i) => (
                          <FormControlLabel
                            key={i}
                            control={<Checkbox />}
                            onClick={(e) =>
                              setValues({
                                ...values,
                                selectedFiles: (e.target as any).checked
                                  ? [...values.selectedFiles, file]
                                  : values.selectedFiles.filter(
                                      (e) => e.id !== file.id
                                    ),
                              })
                            }
                            label={file.name}
                          />
                        ))}
                      </FormGroup>
                    </Grid>
                  </>
                )}
              </Grid>
            );
          })}
      </Grid>
    </Grid>
  );
};

export default Settings;
