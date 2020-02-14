import { Component, ChangeDetectionStrategy, HostBinding, Input, ElementRef } from '@angular/core';

const componentMap: Map<string, number> = 
  new Map<string, number>();

function uniqueClassIdGenerator(token: string): string {
  let n;

  if (componentMap.has(token)) {
    n = componentMap.get(token);
    componentMap.set(token, ++n);
  } else {
    n = 1;
    componentMap.set(token, n);
  }

  return `${token}-${n}`;
}

@Component({
  selector: 'core-component',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreComponent {
  public constructor(protected readonly _el: ElementRef) {
    this.id = uniqueClassIdGenerator(this._el.nativeElement.tagName.toLowerCase());
  }

  @HostBinding('attr.id')
  @Input()
  get id() {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  private _id: string;
}
