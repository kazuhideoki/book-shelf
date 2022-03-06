import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { Button, Grid, Icon, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
// import Link from 'next/link';
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { pdfjs } from "react-pdf";
import { useSetRecoilState } from "recoil";
import { FolderComponent } from "../components/FolderComponent";
import { snackbarState } from "../recoil/atom/snackbar";
import { FrontPath, ServerPath } from "../server/helper/const";
import { RegisterDispalySet } from "../type/api/firestore-display-set-api.type";
import { IFolder } from "../type/domain/folder";
import { DriveFiles } from "../type/model/google-drive-file.type";
import { useRequest } from "../utils/axios";
import { useWithLoading } from "../utils/with-loading";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface P {}

const Settings: NextPage<P> = ({}) => {
  const router = useRouter();
  const request = useRequest();
  const withLoading = useWithLoading();
  const setSnackbar = useSetRecoilState(snackbarState);

  const [values, setValues] = useState<{
    folderNames: string;
    name: string;
  }>({
    folderNames: "",
    name: "",
  });

  const [folder, setFolder] = useState<IFolder>({
    id: "",
    name: "root",
    open: true,
  });

  const folderNameQuery = useMemo(
    () =>
      `(${values.folderNames
        .split(",")
        .map((folderName) => `name contains '${folderName}'`)
        .join(" or ")})`,
    [values.folderNames]
  );

  console.log({ folderNameQuery });

  const handleFetchItems = async () => {
    const res = await request<DriveFiles>("GET", ServerPath.files, {
      params: {
        q: `(mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf') and trashed = false and ${folderNameQuery}`,
        pageToken: folder.meta?.nextPageToken,
      },
    });

    setFolder((prev) => ({ ...prev, items: {} }));
  };

  const handleSubmitDisplaySets = useCallback(async () => {
    try {
      await withLoading(
        request<any, RegisterDispalySet>("POST", ServerPath.displaySets, {
          data: {
            name: values.name,

            // TODO selectedFilesからもってくる
            files: [],
          },
        })
      );

      setSnackbar({
        open: true,
        message: "ディスプレイセットが保存されました",
      });

      console.log("Successfully saved display set!");
    } catch (error) {
      console.log(`Error occurred: ${error}`);
    }
  }, [values]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container spacing={1}>
        <Grid item>
          <Icon sx={{ fontSize: 40 }}>
            <SettingsApplicationsIcon sx={{ fontSize: 40 }} />
          </Icon>
        </Grid>
        <Grid item container spacing={2} alignItems="end">
          <Grid item>
            <Typography variant="h3">表示設定</Typography>
          </Grid>
          <Grid item>
            <Button onClick={() => router.push(FrontPath.top)}>
              <Typography variant="h5">ディスプレイページに戻る</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <FolderComponent
          parentFolder={folder}
          rootSettings={{
            fileQuery: `(mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf') and trashed = false and ${folderNameQuery}`,
            query: values.folderNames,
            onSetQuery: (value) =>
              setValues((prev) => ({ ...prev, folderNames: value })),
          }}
        />
      </Grid>

      <Grid>
        <TextField
          value={values.name}
          label={"ディスプレイセットの名前"}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleSubmitDisplaySets}>
          設定を登録
        </Button>
      </Grid>
    </Grid>
  );
};

export default Settings;
