export interface IMulterFileMixin {
  [fieldname: string]: Express.Multer.File[];
}
