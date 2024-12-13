import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  async uploadProfilePhoto(file: Express.Multer.File): Promise<{
    url: string;
    id: string;
  }> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'profile-photos' },
        (error, result) => {
          if (error) {
            reject(new Error(error.message));
          } else {
            resolve({
              url: result.secure_url,
              id: result.public_id,
            }); // Devuelve solo la URL segura
          }
        },
      );

      upload.end(file.buffer); // Enviar el buffer del archivo
    });
  }

  async uploadProductPhotos(files: Express.Multer.File[]) {
    const uploadedPromises = files.map((file) => {
      return new Promise<{ url: string; id: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'product-photos' }, (error, result) => {
            if (error) {
              reject(new Error(error.message));
            } else {
              resolve({
                url: result.secure_url,
                id: result.public_id,
              });
            }
          })
          .end(file.buffer);
      });
    });
    try {
      const uploadedPhotos = await Promise.all(uploadedPromises);
      return uploadedPhotos;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletePhoto(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }
}
