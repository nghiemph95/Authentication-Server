import fs from 'fs';
import multer from 'multer';
import path from 'path';

export default class Multer {
  private folderName: string;
  private folderPath: string;

  private readonly imageFileTypeOptions = ['image/png', 'image/jpg', 'image/jpeg'];
  private readonly textFileTypeOptions = ['text/csv'];
  private readonly assetsPath = path.join(__dirname, '../../assets');
  private readonly imagePath = `${this.assetsPath}/images`;

  constructor(folderName = 'file') {
    this.folderName = folderName;
    this.folderPath = `${this.imagePath}/${folderName}`;
    if (!fs.existsSync(this.assetsPath)) fs.mkdirSync(this.assetsPath);
    if (!fs.existsSync(this.imagePath)) fs.mkdirSync(this.imagePath);
    if (!fs.existsSync(this.folderPath)) fs.mkdirSync(this.folderPath);
  }

  private storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, this.folderPath),
    filename: (_req, file, cb) => cb(null, file.originalname.toLowerCase().split(' ').join('-')),
  });

  public downloadFile = multer({
    storage: this.storage,
    limits: { fileSize: 1024 * 1024 * 1 } /** 1 MB */,
    fileFilter: (_req, file, cb) => {
      if ([...this.imageFileTypeOptions, ...this.textFileTypeOptions].includes(file.mimetype))
        cb(null, true);
      else cb(null, false);
    },
  });

  public getFolderPath() {
    return this.folderPath;
  }

  public getSingleDownloadFile() {
    return this.downloadFile.single(this.folderName);
  }
}
