import { Folder as FolderIcon, FolderOpen } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedFilesAtom } from "../recoil/atom/selected-files";
import { ServerPath } from "../server/helper/const";
import { IFile } from "../type/domain/file";
import { IFolder } from "../type/domain/folder";
import { ImageSet } from "../type/model/firestore-image-set.type";
import { DriveFiles } from "../type/model/google-drive-file.type";
import { useRequest } from "../utils/axios";

interface P {
  parentFolder: IFolder;
}

export const Folder: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({ parentFolder }) => {
  const request = useRequest();
  const [loading, setLoading] = useState(false);
  const [folder, setFolders] = useState<IFolder>(parentFolder);

  console.log({ valueOfFolder: folder });

  const handleOpen = (id: string, open: boolean) => {
    setFolders((prev) => ({
      ...prev,
      item: {
        ...prev?.item,
        ...prev?.item?.folders?.map((e) => {
          if (e.id === id) {
            return { ...e, open };
          }
          return e;
        }),
      },
    }));
  };

  const handleFetchItems = async () => {
    const res = await request<DriveFiles>("GET", ServerPath.files, {
      params: {
        q: `mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf' and '${folder.id}' in parents and trashed = false`,
        // q: `mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf' and trashed = false`,
        pageToken: folder.meta?.nextPageToken,
      },
    });

    console.log({ resServerPathFiles: res });

    const driveFolders = res.files.filter(
      (e) => e.mimeType === "application/vnd.google-apps.folder"
    );
    const newFolders: IFolder[] = driveFolders.map((e) => ({
      id: e.id,
      name: e.name,
      open: false,
    }));

    const driveFiles = res.files.filter(
      (e) => e.mimeType === "application/pdf"
    );
    const newFiles: IFile[] = driveFiles.map((e) => ({
      id: e.id,
      name: e.name,
    }));

    setFolders((prev) => ({
      ...prev,
      meta: {
        nextPageToken: res.nextPageToken,
        incompleteSearch: res.incompleteSearch,
      },
      item: {
        ...prev.item,
        folders: prev.item?.folders
          ? [...prev.item?.folders, ...newFolders]
          : newFolders,
        files: prev.item?.files ? [...prev.item?.files, ...newFiles] : newFiles,
      },
    }));
  };

  const [selectedFiles, setSelectedFiles] = useRecoilState(selectedFilesAtom);
  const handleSelectFile = useCallback(
    async (file: IFile) => {
      // TODO グローバルで持っている selectedFiles から exsistingをチェック
      const index = selectedFiles.length + 1;
      const exsisting = selectedFiles.find((e) => e.file.id === file.id);

      if (exsisting) {
      } else if (!exsisting) {
        const imageSet = await request<ImageSet>(
          "GET",
          ServerPath.file(file.id)
        );
        file = { ...file, path: imageSet.path };
      }

      setSelectedFiles((prev) =>
        exsisting ? prev : [...prev, { file, index }]
      );
    },
    [request, selectedFiles, setSelectedFiles]
  );
  const handleUnSelectFile = async (file: IFile) => {
    setSelectedFiles((prev) => prev.filter((e) => e.file.id !== file.id));
  };

  return (
    <>
      <Accordion>
        <AccordionSummary onClick={() => handleOpen(folder.id, !folder.open)}>
          <Grid container>
            <Grid item>
              <Icon>{folder.open ? <FolderOpen /> : <FolderIcon />}</Icon>
            </Grid>
            <Grid item>
              <Typography variant="h5">{folder.name}</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => handleFetchItems()}
                // disabled={folder.meta?.incompleteSearch === false}
              >
                ファイルの読み込み
              </Button>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          {folder?.item?.folders?.map((folder, i) => (
            <Folder key={i} parentFolder={folder} />
          ))}
          {folder?.item?.files?.map((file, i) => (
            <Grid key={i} container>
              <Grid item>
                {/* <Icon>
              <Book />
            </Icon> */}
                <FormControlLabel
                  key={i}
                  control={<Checkbox />}
                  onClick={async (e) => {
                    if ((e.target as any).checked) {
                      await handleSelectFile(file);
                    } else {
                      handleUnSelectFile(file);
                    }
                  }}
                  label={file.name}
                />
              </Grid>
              <Grid item>
                <Typography variant="h5">{file.name}</Typography>
              </Grid>
              <Grid item>
                <img width={100} height={100} src={file.path} />
              </Grid>
            </Grid>
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
