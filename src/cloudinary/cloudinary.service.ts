import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary env variables missing!');
    }
  }

  // Rasm upload
  async uploadImage(file: Express.Multer.File, folder = 'users'): Promise<string> {
    return this.upload(file, folder, 'image');
  }

  // Video upload
  async uploadVideo(file: Express.Multer.File, folder = 'courses'): Promise<string> {
    return this.upload(file, folder, 'video');
  }

  private async upload(file: Express.Multer.File, folder: string, resourceType: 'image' | 'video') {
    if (!file || !file.buffer) throw new InternalServerErrorException('File buffer not found');

    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        ).end(file.buffer);
      });

      return result.secure_url;
    } catch (error) {
      console.error('CLOUDINARY REAL ERROR:', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }
  async deleteFile(fileUrl: string) {
    try {

      const parts = fileUrl.split('/');
      const fileNameWithExtension = parts[parts.length - 1]; 
      const folderName = parts[parts.length - 2]; 
      
      const publicId = `${folderName}/${fileNameWithExtension.split('.')[0]}`;

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'auto',
      });

      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
 
    }
  }
}
