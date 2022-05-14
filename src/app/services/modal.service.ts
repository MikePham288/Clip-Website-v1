import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // private visible = false;
  private modals: IModal[] = [];

  constructor() {}
  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string) {
    this.modals.filter((modal) => modal.id !== id);
  }
  isModalVisible(id: string): boolean {
    // return this.visible;
    return !!this.modals.find((modal) => modal.id === id)?.visible; // solution 1
    // return Boolean(this.modals.find((modal) => modal.id === id)?.visible)
  }
  toggleModalVisibility(id: string) {
    const modal = this.modals.find((modal) => modal.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
    // this.visible = !this.visible;
  }
}
