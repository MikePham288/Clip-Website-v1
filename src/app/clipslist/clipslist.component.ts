import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clipslist',
  templateUrl: './clipslist.component.html',
  styleUrls: ['./clipslist.component.css'],
})
export class ClipslistComponent implements OnInit, OnDestroy {
  constructor(public clipService: ClipService) {
    window.addEventListener('scroll', this.handleScroll);
    this.clipService.getClips();
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  ngOnInit(): void {}

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;
    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if (bottomOfWindow) {
      console.log('bottom of window');
      this.clipService.getClips();
    } else {
      console.log(offsetHeight);
    }
  };
}
