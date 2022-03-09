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
import { IFile } from "../type/domain/file";
import { IFolder } from "../type/domain/folder";
import { DriveFiles } from "../type/model/google-drive-file.type";
import { useRequest } from "../utils/axios";
import { ServerPath } from "../utils/const";
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

  console.log({ folder });

  const handleOpen = () => {
    setFolders((prev) => ({ ...prev, open: !prev.open }));
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
        pageToken: folder.meta?.nextPageToken,
      },
    });

    console.log({ resServerPathFiles: res });

    if (!res) {
      setFolders((prev) => ({
        id: prev.id,
        name: prev.name,
        open: prev.open,
      }));

      return;
    }

    const newFolders: IFolder[] = res.files
      .filter((e) => e.mimeType === "application/vnd.google-apps.folder")
      .map((e) => ({
        id: e.id,
        name: e.name,
        open: false,
      }));

    const newFiles: IFile[] = res.files
      .filter((e) => e.mimeType === "application/pdf")
      .map((e) => ({
        id: e.id,
        name: e.name,
      }));

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
      setFolders((prev) => {
        const folders = prev.item?.folders
          ? [
              ...prev.item?.folders,
              ...newFolders.filter(
                (e) =>
                  !prev.item?.folders?.map((folder) => folder.id).includes(e.id)
              ),
            ]
          : newFolders;

        const files = prev.item?.files
          ? [...prev.item?.files, ...newFiles]
          : newFiles.filter(
              (e) => !prev.item?.files?.map((file) => file.id).includes(e.id)
            );

        return {
          ...prev,
          meta: {
            nextPageToken: res.nextPageToken,
            incompleteSearch: res.incompleteSearch,
          },
          item: {
            folders,
            files,
          },
        };
      });
    }
  }, [fileQuery, folder.id, folder.meta?.nextPageToken, request, rootSettings]);

  return (
    <>
      {rootSettings && (
        <Grid item>
          <TextField
            value={query}
            label="ファイル/フォルダー検索"
            placeholder="スペース区切りで入力"
            onChange={(e) => onSetQuery!(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleFetchItems();
                if (!folder.open) handleOpen();
              }
            }}
          />
        </Grid>
      )}
      <Grid item>
        <Accordion
          expanded={folder.open}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          <AccordionSummary>
            <Grid container spacing={1}>
              <Grid item>
                <Icon>{folder.open ? <FolderOpen /> : <FolderIcon />}</Icon>
              </Grid>
              <Grid item>
                <Typography variant="h5">{folder.name}</Typography>
              </Grid>

              <Grid item>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFetchItems();
                    if (!folder.open) handleOpen();
                  }}
                  disabled={
                    folder.meta && folder.meta?.nextPageToken === undefined
                  }
                >
                  {folder.meta && folder.meta?.nextPageToken === undefined
                    ? "読み込み済み"
                    : "読み込む"}
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
