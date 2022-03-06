import { Folder as FolderIcon, FolderOpen } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useState } from "react";
import { ServerPath } from "../server/helper/const";
import { IFile } from "../type/domain/file";
import { IFolder } from "../type/domain/folder";
import { DriveFiles } from "../type/model/google-drive-file.type";
import { useRequest } from "../utils/axios";

interface P {
  folder: IFolder;
}

export const Folder: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({ folder }) => {
  const request = useRequest();
  const [folders, setFolders] = useState<IFolder>(folder);

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
        q: `mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf' and ${folder.id} in parents`,
        pageToken: folder.meta?.nextPageToken,
      },
    });

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
      path: "", // TODO 修正 resから入れる,
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

  return (
    <>
      {folder.item?.folders?.map((folder, i) => (
        <Accordion key={i}>
          <AccordionSummary onClick={() => handleOpen(folder.id, !folder.open)}>
            <Grid container>
              <Grid item>
                <Icon>{folder.open ? <FolderOpen /> : <FolderIcon />}</Icon>
              </Grid>
              <Grid item>
                <Typography variant="h5">{folder.name}</Typography>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={() => handleFetchItems()}>
                  ファイルの読み込み
                </Button>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Folder folder={folder} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};
