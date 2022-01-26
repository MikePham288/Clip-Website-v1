import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  // providers: [ModalService], third way to inject a service
})
export class ModalComponent implements OnInit {
  @Input() modalID = '';
  constructor(public modal: ModalService, public element: ElementRef) {
    // console.log('modal value:', this.modal.visible);
  }

  ngOnInit(): void {
    document.body.appendChild(this.element.nativeElement);
  }
  toggleVisibility(event: Event) {
    this.modal.toggleModalVisibility(this.modalID);
  }
}
