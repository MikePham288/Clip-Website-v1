import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  private readonly EDIT_CLIP = 'editClip';
  constructor(private modalService: ModalService) {}
  ngOnDestroy(): void {
    this.modalService.unregister(this.EDIT_CLIP);
  }

  ngOnInit(): void {
    this.modalService.register(this.EDIT_CLIP);
  }
}
