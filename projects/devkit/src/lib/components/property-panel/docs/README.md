## 属性面板使用说明



在编辑器中点击某控件后，右侧需要显示控件对应的属性面板。目前已将属性面板封装为公共组件并发布NPM包，各特性模块可以直接安装引用。

1、安装：

```
npm install @farris/ide-devkit
```

2、引入模块：

```
import { PropertyPanelModule } from '@farris/ide-devkit';
@NgModule({
    imports: [
        PropertyPanelModule
    ]
})
export class FormEditorPackageModule extends PackageModule {}
```

3、引用组件：

```
<app-property-panel [(propertyConfig)]="propertyConfig" [(propertyData)]="propertyData ">
</app-property-panel>
```

组件参数如下：

| 参数               | 类型                    | 是否必填 | 说明                                                      | 输入/输出 |
| ------------------ | ----------------------- | -------- | --------------------------------------------------------- | --------- |
| propertyConfig     | ElementPropertyConfig[] | 是       | 控件需要展示或编辑的属性列表                              | Input     |
| propertyData       | Object                  | 是       | 控件的属性值对象                                          | Input     |
| showCloseBtn       | boolean                 | 否       | 是否显示关闭按钮                                          | Input     |
| width              | number                  | 否       | 宽度，若为空则继承父组件宽度                              | Input     |
| height             | number                  | 否       | 高度，默认100%                                            | Input     |
| isPersitOpenState  | boolean                 | 否       | 是否持有面板的隐藏显示状态 ，默认false                    | Input     |
| isShowPanel        | boolean                 | 否       | isPersitOpenState=true时，是否隐藏显示控制面板，默认false | Input     |
| closePropertyPanel | EventEmitter<any>       | 否       | isPersitOpenState=true时，抛出面板的关闭事件              | Output    |
| propertyChanged    | EventEmitter<any>       | 否       | 抛出属性变更事件                                          | Output    |
| submitModal        | EventEmitter<any>       | 否       | 抛出模态框属性变更事件                                    | Output    |

若在属性面板中修改了某属性值或属性配置，propertyData和propertyConfig对象会同步修改。

- propertyChanged事件，事件参数为变更的属性对象：

```
{
    propertyID: XXX,
    propertyValue: XXX,
    categoryId: XXX
}
```

- submitModal 事件，事件参数为变更的属性对象和编辑器自定义参数：

```
{
	changeObject: {
      	propertyID: XXX,
    	propertyValue: XXX,
    	categoryId: XXX      
	},
	parameters: XXX
}
```

- refreshPanel方法：手动触发面板刷新

```
 @ViewChild(PropertyPanelComponent) panel: PropertyPanelComponent;
 
 this.panel.refreshPanel();
```



### 配置控件属性

控件属性是指控件需要展示或编辑的属性列表，其结构必须为ElementPropertyConfig类的数组。ElementPropertyConfig类描述了某一分类下的所有属性，以及属性间的关联关系：

| 成员               | 类型             | 是否必填 | 说明                                                         |
| ------------------ | ---------------- | -------- | ------------------------------------------------------------ |
| categoryId         | string           | 是       | 分类ID                                                       |
| categoryName       | string           | 是       | 分类名称                                                     |
| hide               | boolean          | 否       | 是否隐藏分类，默认false                                      |
| hideTitle          | boolean          | 否       | 是否隐藏分类标题，默认false                                  |
| properties         | PropertyEntity[] | 是       | 属性列表                                                     |
| setPropertyRelates | 方法             | 否       | (changeObject, propertyData, parameters?) { } 用于配置属性之间的关联关系，传入变更属性changeObject、属性值propertyData，自定义编辑器场景下还可以传入额外参数parameters |




**PropertyEntity**：

```
export class PropertyEntity {
    propertyID: string; // 属性ID
    propertyName: string; // 属性显示的名称
    propertyType: string; // 属性的类型
    description?: string; // 属性描述
    defaultValue?: any; // 属性的默认值
    readonly?= false; // 是否只读
    visible?= true; // 是否可见
    iterator?: KeyMap[]; // 下拉框的枚举值
    min?: any; // 最小值
    max?: any; // 最大值
    
    numberFormat?: string; // 数字类型属性的格式，参考kendo numeric format
    decimals?: number;  // 数字类型属性的小数位数

    /**
     * 模态框属性配置
     */
    editor?: Type<any>; // 属性自定义编辑器（以模态框的形式展示）
    editorParams?: any; // 自定义编辑器参数
    converter?: TypeConverter; // 属性值转换器,
    showClearButton?= false; // 是否展示清除图标
    
    // 点击清除图标后的方法，参数为清除前的属性值
    afterClickClearButton?(value: any): void;
    
    // 打开模态框前的方法，一般用于校验逻辑，返回值中result=true，则进一步打开模态框，result=false则提		示message内容，并不再打开模态框。
    beforeOpenModal?(): BeforeOpenModalResult { 
        return new BeforeOpenModalResult();
    }

    /**
     * 级联属性
     */
    cascadeConfig?: PropertyEntity[]; // 级联属性配置
    isCollapse?= true; // 级联属性是否收起
    cascadeConverter?: TypeConverter; // 级联属性的汇总信息  
}
```

**TypeConverter**：由模态框转为属性框中展示的值

```
export interface TypeConverter {
    convertTo(data: any, params?: any): string; 
}
```

converTo：将编辑器中给定的值对象转换为String类型，用于显示在属性面板的输入框中。例：

```
class GridFieldConverter implements TypeConverter {
    constructor() { }
    convertTo(data): string {
        return '共 ' + data.length + ' 列';
    }
}
```

**KeyMap**：枚举键值对

```
export interface KeyMap {
    key: any;
    value: any;
}
```

**BeforeOpenModalResult**：打开模态框前的方法返回值

```
export class BeforeOpenModalResult {
    result: boolean;
    message?: string;
}
```



**propertyType**：属性在属性面板中的展示形式：

- ‘string’：普通input输入框

- 'number'：数值型input输入框，还可以定义最大/小值、精度：

  ```
  {
              propertyID: 'order',
              propertyName: '顺序',
              propertyType: 'number',
              min: 0,
              max: 10,
              numberFormat: 'n0',
              decimals: 0
            }
  ```

  

- 'boolean'/'select'：下拉框。其中取值为'select'时iterator为必填项，格式为KeyMap[]枚举值：

  ```
  export interface KeyMap {
      key: any;
      value: any;
  }
  ```

- ‘date’： 日期类型

- 'modal'：自定义的编辑器，取值为'modal'时editor为必填项。在属性面板中显示input输入框和【更多】图标：

  ![](.\images\editor.png)

  点击图标时将动态加载editor组件并以模态框的形式展示：

  ![](.\images\editormodal.png)

  属性面板内部以动态创建组件的方式加载自定义编辑器，因此要求各特性模块在Metadata 对象的 entryComponents中 声明该editor组件。

- 'cascade'：级联类型，点击汇总信息后展示/收折明细属性。

  属性变更后将抛出 propertyChanged/submitModal 事件，参数changeObject中parentPropertyID 为汇总属性ID

  ![](.\images\cascade.png)



**setPropertyRelates方法**

某一分类下的属性之间若有关联关系或者某属性修改后需要自动设置其他属性值，可以传入setPropertyRelates方法，接收参数为当前变更的属性值和完整的属性值。

```
const propertyConfig: ElementPropertyConfig[] = [ {
        categoryId: 'fieldExtendProperty',
        categoryName: '扩展属性',
        properties: extendProperties,
        setPropertyRelates: function (changeObject, propertyData, parameters) {
        
          // 修改属性值（ex：根据'dataSource'的配置设置'valueField'和'textField'）
          if (changeObject && changeObject.propertyID === 'dataSource') {
            propertyData.valueField = parameters.ValueField;
            propertyData.textField = parameters.TextField;
          }
          
          // 修改属性配置（ex：根据'groupable'属性的值控制'group'属性的隐藏和显示）
          if (changeObject && changeObject.propertyID === 'groupable') {
             const page = this.properties.find(p => p.propertyID === 'group');
             page.visible = changeObject.propertyValue;
           }
        }
      }];
```



### 自定义编辑器

以表单列表的列编辑器为例。

- ##### 属性配置

```
{
    propertyID: 'fields',
    propertyName: '列',
    propertyType: 'modal',
    editor: GridFieldEditorComponent,
    editorParams: {
        viewModelId
    },
    converter: new GridFieldConverter()
}
```

自定义编辑器若需要除属性值外的其他参数，可以在属性配置中增加editorParams变量，同时自定义组件中定义名为editorParams的输入参数。

自定义编辑器对应的属性值（对象）与面板input输入框（string）之间若需要进行数据转换，可以传入converter变量，实现TypeConverter接口。

- ##### 自定义编辑器组件

grid-field-editor.component.html：

```
<div>
  ...
</div>

<ng-template #gridFieldFooter>
  <button type="button" class="btn btn-secondary" (click)="clickCancel()">取消</button>
  <button type="button" class="btn btn-primary" (click)="clickConfirm()">确定</button>
</ng-template>
```

grid-field-editor.component.ts：

```
@Component({
  selector: 'app-grid-field-editor',
  templateUrl: './grid-field-editor.component.html',
  styleUrls: ['./grid-field-editor.component.css']
})
export class GridFieldEditorComponent {
  // 关闭模态框的事件
  @Output() closeModal = new EventEmitter<any>();
  
  // 提交模态框的事件
  @Output() submitModal = new EventEmitter<any>();
  
  // 属性值
  @Input() value;
  
  // 接收参数
  @Input() editorParams = {};
 
  // 配置模态框标题、大小、是否显示页脚
  modalConfig = {
    title: '列编辑器',
    width: 900,
    height: 500,
    showButtons: true
  };
  
  // 页脚模板，TemplateRef<any>类型
  @ViewChild('gridFieldFooter') modalFooter: TemplateRef<any>;
  
  constructor() { }

  /**
   * 业务逻辑方法
   * .....
   */
  
  
   /**
   * 确定
   */
  clickOKBtn() {

    // 传入{value,parameters}格式变量,parameters为额外参数
    const object = { value: this.value, parameters: { aa: 123 } };

    // 若不需要参数parameters置为null
    // const object = { value: this.value, parameters: null };

    // 发出事件；组件外可监听submitModal事件获取该object
    this.submitModal.emit(object);
  }

  /**
   * 取消
   */
  clickCancelBtn() {
    this.closeModal.emit();
  }
}
```

- submitModal事件：用于提交变化并关闭模态框。提交{value:XXX,parameters:XXX}类型对象，属性面板会将value值赋值为当前属性值。组件外可监听submitModal事件获取该object处理各自逻辑。
- 若定义了converter属性，面板会调用converter.convertTo方法将该值转换为String类型，用于显示在属性面板的input中。
