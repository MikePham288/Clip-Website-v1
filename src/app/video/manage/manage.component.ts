import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import Clip from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: Clip[] = [];
  activeClip: Clip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
      this.sort$.next(this.videoOrder);
    });
    this.clipService.getUserClip(this.sort$).subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          ...doc.data(),
          documentId: doc.id,
        });
      });
    });
  }

  sort = (event: Event) => {
    const { value } = event.target as HTMLSelectElement;
    // this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        sort: value,
      },
    });
  };

  openModal(event: Event, clip: Clip) {
    event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModalVisibility('editClip');
  }

  update(event: Clip) {
    this.clips.forEach((element, index) => {
      if ((element.documentId = event.documentId)) {
        this.clips[index].clipTitle = event.clipTitle;
      }
    });
  }

  deleteClip(event: Event, clip: Clip) {
    event.preventDefault();
    this.clipService.deleteClip(clip);
    this.clips.forEach((element, index) => {
      if ((element.documentId = clip.documentId)) {
        this.clips.splice(index, 1);
      }
    });
  }
}
