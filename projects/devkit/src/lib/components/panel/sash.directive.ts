import {
  Directive, ElementRef, EmbeddedViewRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, Renderer,
  ViewContainerRef,
  HostListener,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[sash]',
  exportAs: 'sash'
})
export class SashDirective implements OnInit, OnDestroy {

  documentClickListener: any;

  documentMoveListener: any;

  constructor(private _elementRef: ElementRef,
    private renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef) {

  }

  @Input() panelWidth: number;

  @Output() widthChanged = new EventEmitter<number>();

  @HostListener('mousedown') onMouseDown() {
    console.log('mousedown');
    this.bindDocumentClickListener();
  }

  @HostListener('mouseup') onMouseUp() {
    console.log('mouseup');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }



  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'mouseup', (event) => {
        console.log('mouseup');
        console.log(event);
        this.unbindDocumentMoveListener();
        this.unbindDocumentClickListener();
      });

      if (!this.documentMoveListener) {
        this.bindDocumentClickListener = this.renderer.listen('document', 'mousemove', (event) => {
          this.panelWidth = event.clientX;
          const newWidth = event.clientX as number;
          this.widthChanged.emit(newWidth);
        });
      }
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  unbindDocumentMoveListener() {
    if (this.bindDocumentClickListener) {
      this.bindDocumentClickListener();
      this.bindDocumentClickListener = null;
    }
  }
}
