import {
    Component, OnInit, ViewChild, ViewContainerRef, Input,
    OnDestroy, ComponentRef, ComponentFactoryResolver, AfterContentInit, AfterViewInit,
    setTestabilityGetter, OnChanges, SimpleChanges, ViewRef
} from '@angular/core';

@Component({
    selector: 'app-dynamic-component',
    template: '<ng-container #container></ng-container>',
    styleUrls: ['./dynamic-component.component.css']
})
export class DynamicComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit, AfterViewInit {

    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

    @Input() componentName;      // 需要加载的组件名

    compRef: ComponentRef<any>;  //  加载的组件实例
    constructor(private resolver: ComponentFactoryResolver) { }


    private views: ViewRef[] = [];

    loadComponent() {
        const factory = this.resolver.resolveComponentFactory(this.componentName);
        if (this.compRef) {
         this.compRef.destroy();
        }
        this.compRef = this.container.createComponent(factory); // 创建组件
    }

    ngOnInit() {}

    ngAfterContentInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.componentName.isFirstChange()) {
            this.clear();
            this.loadComponent();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => this.loadComponent());
    }

    ngOnDestroy() {
        if (this.compRef) {
            this.compRef.destroy();
        }
    }

    clear() {
        this.container.clear();
    }
}
