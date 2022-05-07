import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  isDragOver = false;
  file: File | null = null;
  showForm = false;
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  showAlert = false;
  alertMessage = 'Please wait! Your video is being uploaded.';
  alertColor = 'blue';
  isSubmitting = false;
  percentage = 0;
  showPercentage = false;
  readonly HUNDRED_PERCENT = 100;

  uploadForm = new FormGroup({
    title: this.title,
  });
  constructor(private angularFireStorage: AngularFireStorage) {}

  ngOnInit(): void {}
  storeFile(event: Event) {
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    console.log('event: ', this.file);
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.showForm = true;
  }

  async uploadFile() {
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    this.isSubmitting = true;
    this.showAlert = true;
    this.showPercentage = true;

    const task = this.angularFireStorage.upload(clipPath, this.file);
    task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / this.HUNDRED_PERCENT;
    });

    task
      .snapshotChanges()
      .pipe(last())
      .subscribe({
        next: (snapshot) => {
          this.alertColor = 'emerald';
          this.alertMessage =
            'Success! Your clip is now ready to share with the world!';
          this.showPercentage = false;
        },
        error: (error) => {
          this.alertColor = 'red';
          this.alertMessage =
            'Error while trying to upload your video! Please try again later';
          this.showPercentage = false;
          console.error(error);
        },
      });
  }
}
