import { ModalFrameComponent } from '../../directives/iframe/modal-frame.component';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from '@farris/ui-modal';

@Component({
  selector: 'farris-modal-panel',
  templateUrl: './modal-panel.component.html',
  styleUrls: ['./modal-panel.component.css']
})
export class ModalPanelComponent implements OnInit {

  private modals: Map<string, BsModalRef>;

  @ViewChild('btns') btns: TemplateRef<any>;

  constructor(private modalService: BsModalService) {
    this.modals = new Map<string, BsModalRef>();
    // this.modalService.show(ModalFrameComponent, {title: 'test', initialState: {src: 'http://www.baidu.com'}});
  }

  ngOnInit() {
  }

  add(plugin: any) {
    const defaultModalOptions = {
      height: 600,
      width: 800,
      showButtons: false,
      enableScroll: false
    };
    plugin.modalOptions = Object.assign(defaultModalOptions, plugin.modalOptions);
    // plugin.modalOptions.buttons = this.btns;

    let url = this.setUrlParam(plugin.url, 'frameID', plugin.frameID);
    url = this.setUrlParam(url, 'command', plugin.command);
    const initialState = { src: url };
    const modalOptions = Object.assign({ title: plugin.title }, plugin.modalOptions, { initialState });
    const modal = this.modalService.show(ModalFrameComponent, modalOptions);
    this.modals.set(plugin.frameID, modal);
  }

  remove(id: string) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.close();
      this.modals.delete(id);
    }
  }

  show(id: string) {
    const modal = this.modals.get(id);
    if (modal) {
      // modal.togg
    }
  }

  hide(id: string) { }

  private setUrlParam(url: string, paramName: string, paramValue: string, override?: boolean) {
    const [path, search] = url.split('?');
    const params = new URLSearchParams(search);
    if (params.has(paramName) && !override) {
      return url;
    }

    params.set(paramName, paramValue);
    return path + '?' + params.toString();
  }

  closeClicked() {
    const confirm = gsp.ide.confirmModal('12');
    if (confirm) {
      this.modals.get('12345').close();
    }
  }
}
