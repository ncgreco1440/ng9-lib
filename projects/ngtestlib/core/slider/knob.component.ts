import { Component, ElementRef, HostListener, Renderer2, HostBinding } from '@angular/core';
import { CoreComponent } from '@ngtestlib/core';
import { SliderComponent } from './slider.component'; 

@Component({
  selector: 'ng-slider-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.scss'],
  host: {
    'class': 'ng-slider-knob-container',
    'tabindex': '0'
  }
})
export class SliderKnobComponent extends CoreComponent {
  public constructor(el: ElementRef, private readonly renderer: Renderer2,
    private readonly slider: SliderComponent) {
    super(el);
    this._initialX = this._el.nativeElement.getBoundingClientRect().x - (this._marginOffset);
  }

  public setValue(value: number): void {
    // const start = this._initialX;
    // const end = this._initialX + 300;
    // const percent = value / end;

    // this.renderer.setStyle(this._el.nativeElement, 'left', `${value}px`);
  }

  @HostListener('mousedown')
  public onMousedown(): void {
    this.grabbed = true;
    this._onStopMouseMove = this.renderer.listen('window', 'mousemove',
      this.onMousemove.bind(this));
    this._onStopMouseUp = this.renderer.listen('window', 'mouseup',
      this.onMouseup.bind(this));
  }

  public onMousemove(event): void {
    this.slider.writeValue(this.slider.value + 1);
    this.renderer.setStyle(this._el.nativeElement, 'left',
      `${(event.clientX - this._initialX - (this._marginOffset * 2))}px`);
  }

  public onMouseup(): void {
    this.grabbed = false;
    this._onStopMouseMove();
    this._onStopMouseUp();
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event): void {
    let currentPos = this._el.nativeElement.getBoundingClientRect().x - this._initialX - 
      this._marginOffset;

    if (event.keyCode == 39 || event.keyCode == 38) {
      this.slider.writeValue(this.slider.value + 1);
      // this.renderer.setStyle(this._el.nativeElement, 'left',
      //   `${++currentPos}px`);
    }

    if (event.keyCode == 37 || event.keyCode == 40) {
      this.slider.writeValue(this.slider.value - 1);
      // this.renderer.setStyle(this._el.nativeElement, 'left',
      //   `${--currentPos}px`);
    }
  }

  @HostBinding('class.grabbed')
  get grabbed() {
    return this._grabbed;
  }
  set grabbed(value: boolean) {
    this._grabbed = value;
  }

  private _onStopMouseMove: () => void;
  private _onStopMouseUp: () => void;
  private _initialX: number;
  private _marginOffset = 25;
  private _grabbed = false;
}