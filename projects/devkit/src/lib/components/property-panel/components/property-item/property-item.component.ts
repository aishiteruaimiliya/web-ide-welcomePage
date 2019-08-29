import {
  Component, OnInit, Input, Output, OnChanges, SimpleChanges,
  EventEmitter, ComponentFactoryResolver, Injector, ElementRef
} from '@angular/core';
import { PropertyEntity } from '../../entity/property-entity';
import { BsModalService } from '@farris/ui-modal';
import { NotifyService, NotifyOptions } from '@farris/ui-notify';

@Component({
  selector: 'webide-property-item',
  templateUrl: './property-item.component.html',
  styleUrls: ['./property-item.component.css']
})
export class PropertyItemComponent implements OnInit, OnChanges {
  @Input() elementConfig: PropertyEntity;
  @Input() elementValue: any;
  @Output() valueChanged = new EventEmitter<any>();
  @Output() submitModal = new EventEmitter<any>();

  elementShowValue: any; // 模态框类型的属性:属性框的展示值
  selectOptions = [];
  itemType = 'string';
  show = true;

  numberRestriction = {
    format: 'n2',
    min: '',
    max: ''
  };
  showClearButton = false;
  constructor(
    private resolver: ComponentFactoryResolver, private modalService: BsModalService,
    private injector: Injector, private notifyServ: NotifyService, public el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    this.refresh();
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    // 是否显示，visible默认true
    if (Object.keys(this.elementConfig).indexOf('visible') < 0) {
      this.show = true;
    } else {
      this.show = this.elementConfig.visible;
    }


    // 显示格式
    const propertyType = this.itemType = this.elementConfig.propertyType;
    switch (propertyType) {
      case 'boolean': {
        this.itemType = 'select';
        this.selectOptions = [{ key: true, value: true }, { key: false, value: false }];
        break;
      }
      case 'select': {
        this.selectOptions = this.elementConfig.iterator;
        break;
      }
      case 'modal': {
        this._convertModalShowValue(this.elementValue);
        break;
      }
      case 'number': {
        // precision待优化为'n2'的格式，与kendo保持一致
        const precision = this.elementConfig.precision;
        if (precision !== undefined && precision > -1) {
          this.numberRestriction.format = 'n' + precision;
        }

        // 支持传入kendo Numeric format格式 ：'n3' / 'p'
        if (this.elementConfig.numberFormat) {
          this.numberRestriction.format = this.elementConfig.numberFormat;
        }

        // 设置最大、最小值
        this.numberRestriction.min = this.elementConfig.min;
        this.numberRestriction.max = this.elementConfig.max;
        break;
      }
      case 'string': {
        if (this.elementConfig.readonly) {
          this._convertModalShowValue(this.elementValue);
        }
        break;
      }
    }
  }


  /**
   * 鼠标移入
   */
  onmouseover() {
    if (!this.elementConfig.showClearButton) {
      return;
    }
    if (!this.showClearButton) {
      this.showClearButton = true;
    }
  }

  /**
   * 鼠标离开
   */
  onmouseleave() {
    if (!this.elementConfig.showClearButton) {
      return;
    }
    this.showClearButton = false;
  }


  /**
   * 清除模态框内容
   */
  modalClear() {
    // 数据转换
    this._convertModalShowValue(null);

    // 若有清除后事件，先执行方法
    if (Object.keys(this.elementConfig).indexOf('afterClickClearButton') > -1 &&
      typeof (this.elementConfig.afterClickClearButton) === 'function') {
      this.elementConfig.afterClickClearButton(this.elementValue);
    }

    const changeObject = {
      propertyID: this.elementConfig.propertyID,
      propertyValue: null
    };
    this.submitModal.emit({ changeObject, parameters: null });
  }

  /**
   * 变更属性值
   */
  changeValue() {
    const changeObject = {
      propertyID: this.elementConfig.propertyID,
      propertyValue: this.elementValue
    };
    this.valueChanged.emit({ changeObject });
  }

  /**
   * 自定义编辑器使用模态框打开
   */
  openModal() {
    if (this.elementConfig.readonly) {
      return;
    }
    if (Object.keys(this.elementConfig).indexOf('beforeOpenModal') > -1 && typeof (this.elementConfig.beforeOpenModal) === 'function') {
      const result = this.elementConfig.beforeOpenModal();
      if (result && !result.result) {
        this.notifyServ.warning({
          title: '系统提示', msg: result.message, timeout: 3000
        } as NotifyOptions);
        return;
      }
    }
    this.createEditorComponent();
  }

  /**
   * 创建自定义编辑器
   */
  private createEditorComponent() {
    const editor = this.elementConfig.editor;
    if (!editor) {
      return;
    }
    // 创建模态框组件
    const compFactory = this.resolver.resolveComponentFactory(editor);
    const compRef = compFactory.create(this.injector);
    compRef.instance.value = this.elementValue;
    if (this.elementConfig.editorParams && compRef.instance.editorParams) {  // 编辑器需要的额外参数
      compRef.instance.editorParams = this.elementConfig.editorParams;
    }
    let modalConfig = compRef.instance.modalConfig;
    if (!modalConfig) {
      modalConfig = {
        title: '属性配置',
        width: 800,
        height: 400,
        showButtons: false
      };
    } else if (modalConfig.showButtons) {
      modalConfig.buttons = compRef.instance.modalFooter;
    }

    const dialog = this.modalService.show(compRef, modalConfig);

    // 监听关闭模态框
    if (compRef.instance.closeModal && compRef.instance.closeModal instanceof EventEmitter) {
      compRef.instance.closeModal.subscribe((data) => {
        // 数据转换
        if (data) {
          this._convertModalShowValue(data);

          const changeObject = {
            propertyID: this.elementConfig.propertyID,
            propertyValue: data
          };
          this.valueChanged.emit({ changeObject });

        }

        dialog.close();
      });
    }



    // 弹出框关闭事件，带参数，格式为{ value, parameters }
    if (compRef.instance.submitModal && compRef.instance.submitModal instanceof EventEmitter) {
      compRef.instance.submitModal.subscribe(data => {
        if (!data) {
          dialog.close();
          return;
        }
        const { value, parameters } = data;
        // 数据转换
        this._convertModalShowValue(value);

        const changeObject = {
          propertyID: this.elementConfig.propertyID,
          propertyValue: value
        };
        this.submitModal.emit({ changeObject, parameters });

        dialog.close();
      });
    }

  }

  /**
   * 模态框场景下将属性值转换为输入框中显示的值
   * @param value
   */
  private _convertModalShowValue(value) {
    if (this.elementConfig.converter) {
      this.elementShowValue = this.elementConfig.converter.convertTo(value);
      return;
    }
    if (value && value instanceof Object) {
      this.elementShowValue = JSON.stringify(value);
      return;
    }
    this.elementShowValue = value;
  }
}
