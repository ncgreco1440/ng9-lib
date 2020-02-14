import { Component, OnInit, ElementRef, forwardRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CoreComponent } from '@ngtestlib/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SliderService } from './slider.service';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ng-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    },
    SliderService
  ]
})
export class SliderComponent extends CoreComponent implements OnInit, AfterViewInit, 
  ControlValueAccessor, OnDestroy {
  
  @Input()
  public get max() {
    return this._max;
  }
  public set max(value: number) {
    this._max = value;
  }

  @Input()
  public get min() {
    return this._min;
  }
  public set min(value: number) {
    this._min = value;
  }

  public constructor(_el: ElementRef, private readonly sliderService: SliderService) {
    super(_el);
  }

  public ngOnInit(): void {
    this.sliderService.registerClientBounds(this.min, this.max);

    this.sliderService.valueChanged().pipe(takeUntil(this._destroy)).subscribe((v: number) => {
      this.writeValue(v);
    });

    this.sliderService.knobMoved().pipe(takeUntil(this._destroy)).subscribe((v: number) => {
      this._knobMoving = true;
      this.writeValue(Math.round(v / 100 * this.max));
      this._knobMoving = false;
    });
  }

  public ngAfterViewInit(): void {}

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public writeValue(val: number): void {
    if (!this._init) {
      if (val !== null && val !== undefined) {
        this.sliderService.init(val);
        this._init = true;
        this.sliderService.move(val);
      }
    } else {
      if (!this._knobMoving) {
        this.sliderService.move(val);
      } else {
        this.sliderService.changeValue(val, false);
      }
    }
    this._value = val;
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

  get value(): number {
    return this._value;
  }

  private _value: number;
  private _destroy: Subject<void> = new Subject<void>();
  private _init: boolean = false;
  private _min: number = 0;
  private _max: number = 100;
  private _knobMoving: boolean = false;
}
