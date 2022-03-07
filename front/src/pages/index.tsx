import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Suspense, useState } from "react";
import { useGoogleLogout } from "react-google-login";
import { pdfjs } from "react-pdf";
import { useRecoilState } from "recoil";
import { Display } from "../components/Display";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { SelectDisplaySetsDialog } from "../components/SelectDisplaySetsDialog";
import { authState } from "../recoil/atom/auth";
import { ImageSet } from "../type/model/firestore-image-set.type";
import { useRequest } from "../utils/axios";
import { useWithLoading } from "../utils/with-loading";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles(() => ({
  root: {
    width: "100vw",
    height: "100vh",
  },
}));

interface P {}

const Home: NextPage<P> = () => {
  const classes = useStyles();
  const router = useRouter();
  const request = useRequest();
  const withLoading = useWithLoading();

  const { signOut } = useGoogleLogout({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID!,
  });
  const [auth, setAuth] = useRecoilState(authState);

  const [showDialog, setShowDialog] = useState(true);

  const [targetImg, setTargetImg] = useState<ImageSet | null>(null);

  return (
    <>
      <Grid
        container
        className={classes.root}
        direction="column"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h6">
            <Link href={process.env.NEXT_PUBLIC_WEB_SERVICE_URL}>
              E Book Shelf
            </Link>
          </Typography>
        </Grid>

        <Grid item xs>
          <ErrorBoundary errorComponent={<>エラーディスプレイだよ</>}>
            <Suspense fallback={<></>}>
              <Display />
            </Suspense>
          </ErrorBoundary>
        </Grid>
        <Grid item container spacing={1} justifyContent="end">
          <Grid item>
            <Button onClick={() => setShowDialog(true)}>
              ディスプレイセット選択
            </Button>
            <Button
              onClick={() => {
                signOut();
                setAuth({ auth: undefined, initialized: false });
              }}
            >
              サインアウト
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>ディスプレイセットの選択</DialogTitle>
        <DialogContent>
          <ErrorBoundary errorComponent={<>エラーだよ</>}>
            <Suspense fallback={<>{"読み込みだよ〜"}</>}>
              <SelectDisplaySetsDialog {...{ setShowDialog }} />
            </Suspense>
          </ErrorBoundary>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
