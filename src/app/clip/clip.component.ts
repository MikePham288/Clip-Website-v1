import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ClipComponent implements OnInit {
  id = '';
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Player;

  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // this.id = this.activatedRoute.snapshot.params.id;
    this.player = videojs(this.target?.nativeElement);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}
