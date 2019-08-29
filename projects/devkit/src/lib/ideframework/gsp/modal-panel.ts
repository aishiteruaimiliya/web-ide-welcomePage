import {BsModalRef} from '../../components/modal';

/// 把bs的BsModalRef包装下，提供hide等接口方法。
export class ModalPanel {
  private modalRef: BsModalRef;
  constructor(modalRef: BsModalRef) {
    this.modalRef = modalRef;
  }

  hide(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
