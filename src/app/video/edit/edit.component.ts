import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import Clip from '../../models/clip.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: Clip | null = null;
  @Output() update = new EventEmitter();
  private readonly EDIT_CLIP = 'editClip';
  showAlert = false;
  isSubmitting = false;
  alertMessage = 'Please wait! Your video is being updated. ';
  alertColor = 'blue';

  clipId = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  editForm = new FormGroup({
    title: this.title,
    id: this.clipId,
  });

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.showAlert = false;
    this.isSubmitting = false;
    if (!this.activeClip) {
      return;
    }
    this.clipId.setValue(this.activeClip.documentId);
    this.title.setValue(this.activeClip.clipTitle);
  }
  ngOnDestroy(): void {
    this.modalService.unregister(this.EDIT_CLIP);
  }

  ngOnInit(): void {
    this.modalService.register(this.EDIT_CLIP);
    this.showAlert = false;
    this.isSubmitting = false;
  }

  async submit() {
    if (!this.activeClip) {
      return;
    }
    this.showAlert = true;
    this.isSubmitting = true;
    this.alertMessage = 'Please wait! Your video is being updated. ';
    this.alertColor = 'blue';

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.alertMessage =
        'Error while trying to update your clip! Please try again later';
      this.alertColor = 'red';
      this.isSubmitting = false;
    }
    this.activeClip.clipTitle = this.title.value;
    this.update.emit(this.activeClip);
    this.alertColor = 'emerald';
    this.alertMessage =
      'Success! Your clip is now ready to share with the world!';
  }
}
