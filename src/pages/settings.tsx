import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { Button, Grid, Icon, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
// import Link from 'next/link';
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { pdfjs } from "react-pdf";
import { useSetRecoilState } from "recoil";
import { Folder } from "../components/Folder";
import { snackbarState } from "../recoil/atom/snackbar";
import { FrontPath, ServerPath } from "../server/helper/const";
import { RegisterDispalySet } from "../type/api/firestore-display-set-api.type";
import { DriveFile } from "../type/model/google-drive-file.type";
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
    name: string;
    folderData: {
      folders: (DriveFile & { files?: DriveFile[]; pageToken?: string })[];
      pageToken: string;
    } | null;
    selectedFiles: { file: DriveFile; index: number; imagePath?: string }[]; // imagePathはimageSetにしていいか
  }>({
    name: "",
    folderData: null,
    selectedFiles: [],
  });

  const handleSubmitDisplaySets = useCallback(async () => {
    try {
      await withLoading(
        request<any, RegisterDispalySet>("POST", ServerPath.displaySets, {
          data: {
            name: values.name,
            files: values.selectedFiles.map((e) => ({
              fileId: e.file.id,
              index: e.index,
            })),
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
        <Folder
          folder={{
            id: "root",
            name: "root",
            open: false,
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
