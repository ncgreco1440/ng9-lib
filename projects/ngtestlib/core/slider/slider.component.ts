import { Component, OnInit, ElementRef, forwardRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CoreComponent } from '@ngtestlib/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SliderKnobComponent } from './knob.component';

@Component({
  selector: 'ng-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent extends CoreComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  public constructor(_el: ElementRef) {
    super(_el);
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {}

  public writeValue(val: number): void {
    this._value = val;
    this.knob?.setValue(val);
    this.onChange(this.value);
  }

  public registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disable: boolean): void {
    this.disabled = disable;
  }

  public onChange = (val: number) => {};
  public onTouched = () => {};

  @Input() 
  public disabled = false;

  @ViewChild(SliderKnobComponent)
  public knob: SliderKnobComponent;

  get value(): number {
    return this._value;
  }

  private _value: number;
}
