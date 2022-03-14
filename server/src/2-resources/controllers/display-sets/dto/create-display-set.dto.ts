export class CreateDisplaySetDto {
  name: string;
  files: {
    fileId: string;
    index: number;
  }[];
}
