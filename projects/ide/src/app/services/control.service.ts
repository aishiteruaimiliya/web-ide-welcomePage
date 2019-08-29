import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { ElementPropertyData } from '../packages/property-package/entity';
// import { ButtonConfig } from '../packages/property-package/entity/element-config/button-config';
// import { InputConfig } from '../packages/property-package/entity/element-config/input-config';

@Injectable()
export class ControlService {
    constructor(private http: HttpClient) {
    }

    // /**
    //  * 根据控件类型获取配置项
    //  * @param type 控件类型
    //  */
    // getEntity(type: string) {
    //     switch (type) {
    //         case 'button': { return new ButtonConfig(); }
    //         case 'input': { return new InputConfig(); }
    //     }
    // }

    // /**
    //  * mock 获取按钮对应的配置值
    //  */
    // getBtnData(): Observable<ElementPropertyData> {
    //     return this.http.get<ElementPropertyData>('assets/mock-data/buttonData.json');
    // }

    // /**
    //  * mock 获取输入框对应的配置值
    //  */
    // getInputData(): Observable<ElementPropertyData> {
    //     return this.http.get<ElementPropertyData>('assets/mock-data/inputData.json');
    // }

}
