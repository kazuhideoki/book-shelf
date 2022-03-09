import { readFileSync } from 'fs';
import { fromBase64 } from 'pdf2pic';
import { Options } from 'pdf2pic/dist/types/options';

export const convertPDFToImage = async (
  fileId: string,
  data: string,
  options?: Options,
) => {
  const _options = {
    density: 100,
    saveFilename: fileId,
    savePath: `./tmp`,
    format: 'png',
    ...options,
  };

  const image = await fromBase64(
    data,
    _options,
  )(1).catch((e) => console.log(`error occurred in fromBase64: ${e}`));
  console.log({ imageResBase64: image });

  return readFileSync((image as any).path);
};
