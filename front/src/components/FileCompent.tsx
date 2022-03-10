import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { ServerPath } from "../../../server/src/type/const";
import { IFile } from "../../../server/src/type/domain/file";
import { ImageSet } from "../../../server/src/type/model/firestore-image-set.type";
import { selectedFilesState } from "../recoil/atom/selected-files";
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

  const [path, setPath] = useState("");

  const [selectedFiles, setSelectedFiles] = useRecoilState(selectedFilesState);
  const handleSelectFile = useCallback(
    async (file: IFile) => {
      // TODO グローバルで持っている selectedFiles から exsistingをチェック
      const index = selectedFiles.length + 1;
      const exsisting = selectedFiles.find((e) => e.fileId === file.id);

      if (exsisting) {
      } else if (!exsisting) {
        const imageSet = await request<ImageSet>(
          "GET",
          ServerPath.file(file.id)
        );

        setPath(imageSet.path);
      }

      setSelectedFiles((prev) =>
        exsisting ? prev : [...prev, { fileId: file.id, index }]
      );
    },
    [request, selectedFiles, setSelectedFiles]
  );
  const handleUnSelectFile = async (file: IFile) => {
    setSelectedFiles((prev) => prev.filter((e) => e.fileId !== file.id));
  };

  return (
    <Grid container>
      <Grid item>
        <FormControlLabel
          control={<Checkbox />}
          onClick={async (e) => {
            e.stopPropagation();
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
        <img width={100} height={100} src={path} />
      </Grid>
    </Grid>
  );
};
