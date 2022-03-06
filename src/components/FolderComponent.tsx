import { Folder as FolderIcon, FolderOpen } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Icon,
  TextField,
  Typography,
} from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useCallback, useState } from "react";
import { ServerPath } from "../server/helper/const";
import { IFile } from "../type/domain/file";
import { IFolder } from "../type/domain/folder";
import { DriveFiles } from "../type/model/google-drive-file.type";
import { useRequest } from "../utils/axios";
import { FileComponent } from "./FileCompent";

interface P {
  parentFolder: IFolder;
  rootSettings?: {
    fileQuery: string;
    query: string;
    onSetQuery: (value: string) => void;
  };
}

export const FolderComponent: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({ parentFolder, rootSettings }) => {
  const fileQuery = rootSettings?.fileQuery;
  const query = rootSettings?.query;
  const onSetQuery = rootSettings?.onSetQuery;

  const request = useRequest();

  const [folder, setFolders] = useState<IFolder>(parentFolder);

  if (rootSettings) {
    console.log({ folder });
  }
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

  const handleFetchItems = useCallback(async () => {
    console.log({ fileQuery });

    const q =
      fileQuery ??
      `(mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf') and '${folder.id}' in parents and trashed = false`;

    console.log({ q });

    const res = await request<DriveFiles>("GET", ServerPath.files, {
      params: {
        q,
        // q: `mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf' and trashed = false`,
        pageToken: folder.meta?.nextPageToken,
      },
    });

    console.log({ resServerPathFiles: res });

    if (!res) {
      return;
    }

    const driveFolders = res.files.filter(
      (e) => e.mimeType === "application/vnd.google-apps.folder"
    );
    const newFolders: IFolder[] = driveFolders.map((e) => ({
      id: e.id,
      name: e.name,
      open: false,
    }));
    // .filter(
    //   (e) => !folder.item?.folders?.map((folder) => folder.id)?.includes(e.id)
    // );

    const driveFiles = res.files.filter(
      (e) => e.mimeType === "application/pdf"
    );
    const newFiles: IFile[] = driveFiles.map((e) => ({
      id: e.id,
      name: e.name,
    }));
    // .filter(
    //   (e) => !folder.item?.files?.map((file) => file.id)?.includes(e.id)
    // );
    if (rootSettings) {
      setFolders((prev) => ({
        ...prev,
        meta: {
          nextPageToken: res.nextPageToken,
          incompleteSearch: res.incompleteSearch,
        },
        item: {
          folders: newFolders,
          files: newFiles,
        },
      }));
    } else {
      setFolders((prev) => ({
        ...prev,
        meta: {
          nextPageToken: res.nextPageToken,
          incompleteSearch: res.incompleteSearch,
        },
        item: {
          folders: prev.item?.folders
            ? [...prev.item?.folders, ...newFolders]
            : newFolders,
          files: prev.item?.files
            ? [...prev.item?.files, ...newFiles]
            : newFiles,
        },
      }));
    }
  }, [fileQuery, folder.id, folder.meta?.nextPageToken, request, rootSettings]);

  return (
    <>
      {rootSettings && (
        <Grid item>
          <TextField
            value={query}
            label="ファイル/フォルダー検索"
            placeholder="カンマ(,)区切りで入力"
            onChange={(e) => onSetQuery!(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleFetchItems();
            }}
          />
        </Grid>
      )}
      <Grid item>
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
              <FolderComponent
                key={`folder_${folder.id}_${i}`}
                parentFolder={folder}
              />
            ))}
            {folder?.item?.files?.map((file, i) => (
              <FileComponent key={`file_${folder.id}_${i}`} file={file} />
            ))}
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};
