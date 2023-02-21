import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Observable } from 'rxjs';


@Injectable()
export class PhotosService {
    async deleteImage(fileName: string): Promise < void> {
        try {
            fs.unlinkSync(`StaticFiles/images/${fileName}`);
        } catch(error) {
            throw new Error(`Failed to delete image with name ${fileName}`);
        }
}

}
