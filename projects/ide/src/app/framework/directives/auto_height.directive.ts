import { Directive, HostBinding, HostListener, Input, OnChanges, SimpleChanges,
    OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { WindowService } from '../services/window.service';

@Directive({
    selector: '[autoHeight]',
    exportAs: 'autoHeight'
})
export class AutoHeightDirective implements OnInit, OnChanges, AfterViewInit {
    @HostBinding('style.height') height: string;

    @Input() position;

    @Output() windowResize = new EventEmitter();

    constructor(private winSer: WindowService) {
        this.position = { top: 0, bottom: 0 };
    }

    ngOnInit() {
        this.height = this.getRealHeight(this.winSer.size.height);
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes['position'].currentValue);
        // this.position = Object.assign({top: 0, bottom: 0}, changes['position'].currentValue);
        // console.log(this.position);
        // this.height = this.getRealHeight(window.innerHeight);
    }

    ngAfterViewInit() {
        // console.log('AH');
    }

    get containerHeight(): number {
        return Number.parseInt(this.height.replace('px', ''));
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event) {
        this.height = this.getRealHeight(event.target.innerHeight);
        this.windowResize.emit(this.containerHeight);
    }

    private getRealHeight(height: number) {
        return height + (this.position.top || 0) + (this.position.bottom || 0) + 'px';
    }
}
