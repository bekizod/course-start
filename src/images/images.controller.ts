// src/images/images.controller.ts
import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ResponseFormat } from 'src/common/utils/response.util';

@Controller('images')
export class ImagesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image')) // 'image' is the field name in form-data
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    if (!result) {
      throw new Error('Image upload failed');
    }
    return ResponseFormat.success('Image uploaded successfully', {
      data: {
        url: result.secure_url,
        publicId: result.public_id.split('/').pop(), // Only the file id
      },
    });
  }

  @Delete('delete/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    const fullPublicId = `nest-uploads/${publicId}`;
    const result = await this.cloudinaryService.deleteImage(fullPublicId);
    await this.cloudinaryService.deleteImage(fullPublicId);
    if (!result) {
      throw new Error('Image deletion failed');
      throw new Error('Image deletion failed');
    }
    return ResponseFormat.success('Image deleted successfully');
  }
}
