import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { selectedFilesAtom } from "../recoil/atom/selected-files";
import { ServerPath } from "../server/helper/const";
import { IFile } from "../type/domain/file";
import { ImageSet } from "../type/model/firestore-image-set.type";
import { useRequest } from "../utils/axios";

interface P {
  file: IFile;
}

export const FileComponent: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({ file }) => {
  const request = useRequest();

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
    <Grid container>
      <Grid item>
        <FormControlLabel
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
  );
};
