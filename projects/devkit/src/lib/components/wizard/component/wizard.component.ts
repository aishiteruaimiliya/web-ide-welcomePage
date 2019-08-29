import {
  Component, OnInit, Input, ViewChild, ComponentRef, ViewContainerRef, ComponentFactoryResolver,
  Output, EventEmitter
} from '@angular/core';
import { find, findIndex, merge } from 'lodash-es';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {
  @Output() clickCancelBtn = new EventEmitter<any>();
  @Output() clickFinishBtn = new EventEmitter<any>();

  @Input() title = '';
  @Input() steps = [];
  curStep;
  curStepIndex = 0;
  curComponentRef: ComponentRef<any>;
  // finishedSteps = [];
  @ViewChild('stepContainer', { read: ViewContainerRef }) stepContainer: ViewContainerRef;

  constructor(private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    if (this.steps && this.steps.length > 0) {
      this.curStep = this.steps[this.curStepIndex];
      this.createStepComponent(this.steps[this.curStepIndex]);
    }
  }
  createStepComponent(step) {
    this.stepContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(step.component);
    this.curComponentRef = this.stepContainer.createComponent(componentFactory);
    this.curComponentRef.instance.data = step.data;

    // 新增步骤
    if (this.curComponentRef.instance.addStep) {
      this.curComponentRef.instance.addStep.subscribe((stepList) => {

        const curIndex = findIndex(this.steps, this.curStep);
        this.steps.splice(curIndex + 1, 0, ...stepList);

        this.curStep.nextStep = stepList[0].stepId;
        this.curStep.showFinishBtn = false;
        this.curStep.showNextStepBtn = true;

      });
    }
    // 删除步骤
    if (this.curComponentRef.instance.removeStep) {
      this.curComponentRef.instance.removeStep.subscribe((data) => {
        merge(this.curStep, data.curStep);
        data.removeSteps.forEach(removeStep => {
          const index = findIndex(this.steps, removeStep);
          this.steps.splice(index, 1);
        });
      });
    }
    // 变更步骤
    if (this.curComponentRef.instance.changeStep) {
      this.curComponentRef.instance.changeStep.subscribe((stepList) => {
        stepList.forEach(changeStep => {
          const oldStep = find(this.steps, function (s) { return s.stepId === changeStep.stepId; });
          merge(oldStep, changeStep);
        });
      });
    }

  }
  jumpStep(nextStep) {
    // 判断跳转方向
    if (nextStep === this.curStep) {
      return;
    }
    const nextIndex = findIndex(this.steps, function (s) { return s.stepId === nextStep.stepId; });
    if (nextIndex === this.curStepIndex) {
      return;
    }
    if (nextIndex < this.curStepIndex) { // 向前跳
      this.curStep = nextStep;
      this.curStepIndex = nextIndex;
      this.createStepComponent(nextStep);
      return;
    }
    if (nextStep.stepId === this.curStep.nextStep) { // 下一步
      this.nextStep();
      return;
    }
    //  else if (this.finishedSteps.indexOf(nextStep.stepId) > -1) { // 已完成的后续步骤
    //   this.curStep = nextStep;
    //   this.curStepIndex = nextIndex;
    //   this.createStepComponent(nextStep);
    // }

  }
  /**
    * 点击上一步
    */
  lastStep() {
    const self = this;
    this.curStepIndex = findIndex(this.steps, function (s) { return s.nextStep === self.curStep.stepId; });
    this.curStep = this.steps[this.curStepIndex];
    this.createStepComponent(this.curStep);
  }

  /**
   * 点击下一步
   */
  nextStep() {
    // 校验
    const validationFunc = this.curComponentRef.instance.validation;
    if (validationFunc && typeof (validationFunc) === 'function') {
      const result = validationFunc();
      if (!result) { return; }
    }
    // 执行各Component定义的nextStepClick事件
    const clickNextStep = this.curComponentRef.instance.clickNextStep;
    if (clickNextStep && typeof (clickNextStep) === 'function') {
      const result = clickNextStep(); // 返回值接收boolean或observable类型
      if (typeof (result) === 'boolean') {
        this.moveToNextStep(result);
      } else {
        result.subscribe(data => {
          this.moveToNextStep(data);
        });
      }
    } else {
      this.moveToNextStep(true);
    }
  }

  moveToNextStep(data) {
    if (!data) {
      return;
    }
    const curStep = this.curStep;
    if (curStep.nextStep === '') {
      return;
    }
    // this.finishedSteps.push(curStep.stepId);
    this.curStepIndex = findIndex(this.steps, function (s) { return s.stepId === curStep.nextStep; });
    if (this.curStepIndex > -1) {
      this.curStep = this.steps[this.curStepIndex];
      this.createStepComponent(this.curStep);
    }

  }
  /**
   * 取消
   */
  clickCancel() {
    this.clickCancelBtn.emit();
  }
  /**
   * 完成
   */
  finishWizard() {
    const validationFunc = this.curComponentRef.instance.validation;
    if (validationFunc && typeof (validationFunc) === 'function') {
      const result = validationFunc();
      if (!result) { return; }
    }

    const beforeFinish = this.curComponentRef.instance.beforeFinish;
    if (beforeFinish && typeof (beforeFinish) === 'function') {
      const result = beforeFinish();
      if (!result) { return; }
    }
    this.clickFinishBtn.emit();
  }
}
