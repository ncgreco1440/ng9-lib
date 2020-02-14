import { Component, ElementRef, HostListener, Renderer2, HostBinding } from '@angular/core';
import { CoreComponent } from '@ngtestlib/core';
import { SliderService } from './slider.service';

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
    private readonly sliderService: SliderService) {
    super(el);
    this.sliderService.moveKnob().subscribe(pos => {
      this.renderer.setStyle(this._el.nativeElement, 'left', `${pos}%`);
    });
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
    const rect = this._el.nativeElement.parentNode.getBoundingClientRect();
    // X Position of the mouse relative to the knob's parent container
    const posRelativeToSlider = event.clientX - rect.left;
    const percent = this.sliderService.linearCalculateRaw(posRelativeToSlider, this._el.nativeElement.parentNode.clientWidth);
    this.renderer.setStyle(this._el.nativeElement, 'left', `${percent}%`);
    this.sliderService.mouseMove(posRelativeToSlider, this._el.nativeElement.parentNode.clientWidth);
  }

  public onMouseup(): void {
    this.grabbed = false;
    this._onStopMouseMove();
    this._onStopMouseUp();
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event): void {
    if (event.keyCode == 39 || event.keyCode == 38) {
      this.sliderService.changeValue(this.sliderService.currentValue + 1);
    }

    if (event.keyCode == 37 || event.keyCode == 40) {
      this.sliderService.changeValue(this.sliderService.currentValue - 1);
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
  private _marginOffset = 25;
  private _grabbed = false;
}