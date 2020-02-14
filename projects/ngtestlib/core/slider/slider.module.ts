import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from './slider.component';
import { SliderKnobComponent } from './knob.component';


@NgModule({
  declarations: [SliderComponent, SliderKnobComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [SliderComponent, SliderKnobComponent]
})
export class SliderModule { }
