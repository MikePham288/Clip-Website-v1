import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { switchMap, combineLatest, forkJoin } from 'rxjs';
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
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

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

  async storeFile(event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];

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

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );

    const screenshotPath = `screenshots/${clipFileName}.png`;
    this.task = this.angularFireStorage.upload(clipPath, this.file);
    const clipRef = this.angularFireStorage.ref(clipPath);

    this.screenshotTask = this.angularFireStorage.upload(
      screenshotPath,
      screenshotBlob
    );

    const screenshotRef = this.angularFireStorage.ref(screenshotPath);
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;
      if (!clipProgress || !screenshotProgress) {
        return;
      }
      const total = clipProgress + screenshotProgress;
      this.percentage = (total as number) / (this.HUNDRED_PERCENT * 2);
    });

    // wait for both subscriptions to complete, then stream the value to subscriber
    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges(),
    ])
      .pipe(
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls;
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            clipTitle: this.title.value as string,
            fileName: `${clipFileName}.mp4` as string,
            clipUrl: clipURL,
            screenshotURL,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            screenshotFileName: `${clipFileName}.png`,
          };
          const clipDocumentRef = await this.clipService.addClip(clip);
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
