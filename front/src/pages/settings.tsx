import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { Button, Grid, Icon, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
// import Link from 'next/link';
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { RegisterDispalySet } from "../../../server/src/type/api/firestore-display-set-api.type";
import { FrontPath, ServerPath } from "../../../server/src/type/const";
import { FolderComponent } from "../components/FolderComponent";
import { displaySetsState } from "../recoil/atom/display-set";
import { selectedFilesState } from "../recoil/atom/selected-files";
import { snackbarState } from "../recoil/atom/snackbar";
import { useRequest } from "../utils/axios";
import { useWithLoading } from "../utils/with-loading";

interface P {}

const Settings: NextPage<P> = ({}) => {
  const router = useRouter();
  const request = useRequest();
  const withLoading = useWithLoading();
  const setSnackbar = useSetRecoilState(snackbarState);
  const setDisplaySets = useSetRecoilState(displaySetsState);

  const [values, setValues] = useState<{
    folderNames: string;
    name: string;
  }>({
    folderNames: "",
    name: "",
  });

  const folderNameQuery = useMemo(
    () =>
      `(${values.folderNames
        .split(" ")
        .map((folderName) => `name contains '${folderName}'`)
        .join(" or ")})`,
    [values.folderNames]
  );

  const selectedFiles = useRecoilValue(selectedFilesState);
  const handleSubmitDisplaySets = useCallback(async () => {
    try {
      const res = await withLoading(
        request<any, RegisterDispalySet>("POST", ServerPath.displaySets, {
          data: {
            name: values.name,
            files: [...selectedFiles],
          },
        })
      );

      setDisplaySets((prev) => ({
        ...prev,
        displaySets: [...prev.displaySets, res],
      }));

      setSnackbar({
        open: true,
        message: "ディスプレイセットが保存されました",
      });

      console.log("Successfully saved display set!");
    } catch (error) {
      console.log(`Error occurred: ${error}`);
    }
  }, [request, selectedFiles, setSnackbar, values.name, withLoading]);

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
          parentFolder={{
            id: "",
            name: "root",
            open: false,
          }}
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
          onKeyPress={async (e) => {
            if (e.key === "Enter") {
              await handleSubmitDisplaySets();
            }
          }}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          onClick={async () => {
            await handleSubmitDisplaySets();
          }}
        >
          設定を登録
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={() => router.push(FrontPath.top)}>
          <Typography variant="h5">ディスプレイページに戻る</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default Settings;
