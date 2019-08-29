import { EventEmitter } from '@angular/core';

export class WindowService {
    private winSize: {width: any, height: any};

    onResize = new EventEmitter();

    constructor() {
       this.resize();
    }

    resize() {
        this.winSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    get size() {
        this.resize();
        return this.winSize;
    }
}

