import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-split',
    template: './split.component.html',
    styleUrls: ['./split.component.css']
})
export class SplitComponent implements OnInit {

    /** 类型 row(行) | column(列) */
    @Input() type: 'row'| 'column' = 'row';

    /** 分隔的数量， 至少为2列或2行 */
    @Input() amount = 2;



    constructor() { }

    ngOnInit() {
    }

}
