import { Type } from '@angular/core';

// 控件全部配置
export class ElementPropertyConfig {
    categoryId: string;
    categoryName: string;
    hide?= false;
    hideTitle?= false;
    properties: PropertyEntity[];
    propertyData?: any;
    setPropertyRelates?: (changeObject, propertyData, parameters?) => void;
}



// 属性实体
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
     * 级联属性
     */
    cascadeConfig?: PropertyEntity[]; // 级联属性配置
    isCollapse?= true; // 级联属性是否收起
    cascadeConverter?: TypeConverter; // 级联属性的汇总信息

    [propName: string]: any;

    /**
     * 模态框属性配置
     */
    editor?: Type<any>; // 属性自定义编辑器（以模态框的形式展示）
    editorParams?: any; // 自定义编辑器参数
    converter?: TypeConverter; // 属性值转换器,
    showClearButton?= false; // 是否展示清除图标

    // 打开模态框前的方法，一般用于校验逻辑，返回值中result=true，则进一步打开模态框，result=false则提示message内容，并不再打开模态框。
    beforeOpenModal?(): BeforeOpenModalResult {
        return new BeforeOpenModalResult();
    }

    // 点击清除按钮后的方法，参数为清除前的属性值
    afterClickClearButton?(value: any): void;

}

// 转换器
export interface TypeConverter {
    convertTo(data: any, params?: any): string; // 由模态框转为属性框中展示的值
}

export interface KeyMap {
    key: any;
    value: any;
}

export class BeforeOpenModalResult {
    result: boolean;
    message?: string;
}
