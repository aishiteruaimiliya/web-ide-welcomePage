import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges,
    forwardRef, Inject, Injector, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { AngularDraggableDirective } from '../../directives/angular-draggable.directive';
import { WindowService } from '../../services/window.service';


@Component({
    selector: 'app-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() bounds: HTMLDivElement;
    @Input() width: number;
    @Input() height: number;
    @Input() top: number;

    @ViewChild(AngularDraggableDirective) horizontalBar: AngularDraggableDirective;

    @Output() resizing = new EventEmitter();

    style: any = {};

    originalTop: any ;
    originalHeight: number;
    originalWidth: number;

    isOpen = true;
    currentHeight: number;

    windowService: WindowService;

    constructor(private injector: Injector) {
        this.windowService = this.injector.get(WindowService);

        this.windowService.onResize.subscribe( (size: any) => {
            this.style.top = size.height - this.height - 22 + 'px';
            this.originalTop = this.style.top;
            this.originalHeight = this.height;
            this.originalWidth = this.width;
            if (this.isOpen) {
                this.horizontalBar.resetPosition();
            }
        });
    }

    ngOnInit() {
        this.originalHeight = this.height;
        this.originalWidth = this.width;

        this.style = {
            height: this.height + 'px',
            width: this.width + 'px',
            top: this.top + 'px'
        };

        setTimeout(() => {
            this.originalTop = this.top + 'px';
            this.style.top = this.originalTop;
          this.collapse();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['width'] && !changes['width'].isFirstChange()) {
            this.style = Object.assign(this.style, {
                width: this.width  + 'px',
            });

            this.originalWidth = this.width;
        }
    }

    ngAfterViewInit() {
    }

    onMoving(pos: any) {
        this.height = this.originalHeight - pos.y;
        this.width = this.originalWidth - pos.x;
        this.style = {
            width: this.width  + 'px',
            height: this.height + 'px',
            // top: this.bounds.clientHeight - this.height + 'px'
        };

        this.resizing.emit({ height: this.height, target: this });
    }

    collapse() {
        if (this.isOpen) {
            this.currentHeight = this.height;
            this.isOpen = false;
            this.height = 0;
            this.horizontalBar.minHeight = 0;


            this.style = {
                width: this.width  + 'px',
                height: this.height + 'px',
                top: this.bounds.clientHeight - this.height + 'px'
            };
            // this.originalTop = this.style.top;
            this.horizontalBar.resetPosition();
            this.resizing.emit({ height: this.height, target: this });
        }
    }

    expand() {
        if (!this.isOpen) {
            this.height = this.currentHeight;
            this.isOpen = true;
            this.horizontalBar.minHeight = 140;

            this.style = {
                width: this.width  + 'px',
                height: this.height + 'px',
                top: this.bounds.clientHeight - this.height + 'px'
            };
            this.resizing.emit({ height: this.height, target: this });
        }
    }
}
