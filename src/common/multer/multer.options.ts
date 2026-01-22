import * as multer from 'multer';

export const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, 
  },
};
