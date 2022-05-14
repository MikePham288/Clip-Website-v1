import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import Clip from '../models/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Player;
  clip?: Clip;

  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    this.activatedRoute.data.subscribe((data) => {
      this.clip = data.clip as Clip;
      this.player?.src({
        src: this.clip.clipUrl,
        type: 'video/mp4',
      });
    });
  }
}
