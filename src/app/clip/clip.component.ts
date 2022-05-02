import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
})
export class ClipComponent implements OnInit {
  id = '';
  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // this.id = this.activatedRoute.snapshot.params.id;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}
