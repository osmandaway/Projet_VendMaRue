import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirmation</h4>
      <button type="button" class="close" aria-label="Close" (click)="close()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      {{ message }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="confirm()">Oui</button>
      <button type="button" class="btn btn-secondary" (click)="close()">Non</button>
    </div>
  `
})
export class ConfirmationDialogComponent {
  @Input() message?: string;


  constructor(public activeModal: NgbActiveModal) { }

  confirm() {
    this.activeModal.close('confirm');
  }

  close() {
    this.activeModal.dismiss();
  }
}