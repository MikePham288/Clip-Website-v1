import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isReady = false;
  private ffmpeg;
  isRunning = false;
  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) {
      return;
    }
    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data); // saving file to memory

    // get screenshots from different time stamp
    const seconds = [1, 2, 3];
    const commands: string[] = [];
    seconds.forEach((second) => {
      commands.push(
        // Input
        '-i', // file name
        file.name,
        // Output Options
        '-ss', // time stamp
        `00:00:0${second}`,
        '-frames:v', // which frame to capture
        '1',
        '-filter:v', // resize image
        'scale=510:-1', // into this scale (-1 to calculate the height to preserve the aspect value)
        // Output
        `output_0${second}.png`
      );
    });
    await this.ffmpeg.run(...commands);
    const screenshots: string[] = [];

    seconds.forEach((second) => {
      `output_0${second}.png`;
      const screenshotFile = this.ffmpeg.FS(
        'readFile',
        `output_0${second}.png`
      );
      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png',
      });

      const screenshotURL = URL.createObjectURL(screenshotBlob);
      screenshots.push(screenshotURL);
    });
    this.isRunning = false;
    return screenshots;
  }

  async blobFromURL(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }
}
