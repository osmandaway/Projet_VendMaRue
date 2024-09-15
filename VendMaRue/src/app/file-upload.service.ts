import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private storage: AngularFireStorage) { }

  uploadImage(file: File): Promise<string> {
    const filePath = `images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((downloadURL: string) => {
            resolve(downloadURL);
          }, (error: any) => {
            reject(error);
          });
        })
      ).subscribe();
    });
  }
  async getImageUrl(imageName: string): Promise<string> {
    const storageRef = this.storage.ref('images/' + imageName);
    return storageRef.getDownloadURL().toPromise();
  }

}
