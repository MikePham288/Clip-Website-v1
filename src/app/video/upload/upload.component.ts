import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from '../../services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  file: File | null = null;
  showForm = false;
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  showAlert = false;
  alertMessage = 'Please wait! Your video is being uploaded. ';
  alertColor = 'blue';
  isSubmitting = false;
  percentage = 0;
  showPercentage = false;
  readonly HUNDRED_PERCENT = 100;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private angularFireStorage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile(event: Event) {
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    console.log('event: ', this.file);
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.showForm = true;
  }

  async uploadFile() {
    this.uploadForm.disable();
    this.isSubmitting = true;
    this.showAlert = true;
    this.showPercentage = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    this.task = this.angularFireStorage.upload(clipPath, this.file);
    const clipRef = this.angularFireStorage.ref(clipPath);
    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / this.HUNDRED_PERCENT;
    });

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            clipTitle: this.title.value as string,
            fileName: `${clipFileName}.mp4` as string,
            url,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          const clipDocumentRef = await this.clipService.addClip(clip);
          console.log(clip);
          this.alertColor = 'emerald';
          this.alertMessage =
            'Success! Your clip is now ready to share with the world!';
          this.showPercentage = false;
          setTimeout(() => {
            this.router.navigate(['clip', clipDocumentRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMessage =
            'Error while trying to upload your video! Please try again later';
          this.showPercentage = false;
          console.error(error);
        },
      });
  }
}
