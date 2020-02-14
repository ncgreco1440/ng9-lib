import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'; 

@Injectable()
export class SliderService {
  private _subject: Subject<number> = new Subject<number>();
  private _move: Subject<number> = new Subject<number>();
  private _knobMoved: Subject<number> = new Subject<number>();

  public valueChanged(): Observable<number> {
    return this._subject;
  }

  public moveKnob(): Observable<number> {
    return this._move;
  }

  public knobMoved(): Observable<number> {
    return this._knobMoved;
  }

  public move(num: number): void {
    this._move.next(this.linearCalculate(num));
  }

  public mouseMove(num: number, bounding: number): void {
    this._knobMoved.next(this.linearCalculateRaw(num, bounding));
  }

  public changeValue(num: number, emit: boolean = true): void {
    this._currentValue = num;
    if (emit) {
      this._subject.next(num);
      this._move.next(this.linearCalculate(num));
    }
  }

  public init(num: number): void {
    this._currentValue = num;
    this._move.next(num);
  }

  public registerClientBounds(min: number, max: number): void {
    this._max = max;
    this._min = min;
  } 

  get currentValue(): number {
    return this._currentValue;
  }

  /**
   * @unstable this function is expected to change
   * Logarithmic Normalization of the value set by the NgControl for the knob
   * respective of the clientWidth. Still a WIP
   * @param n 
   */
  private calculate(n: number): number {
    if (n > this._boundingMax) {
      return (this._boundingMax / n) * n;
    }
    return (n / this._boundingMax) * n; 
  }

  /**
   * Normalized percentage of the value set in relation to the clientWidth
   * of the knob's parent container
   * @param n 
   */
  private linearCalculate(n: number): number {
    return ((n - this._min) / (this._max - this._min)) * 100;
  }

    /**
   * Normalized percentage of the value set in relation to the clientWidth
   * of the knob's parent container
   * @param n 
   */
  public linearCalculateRaw(n: number, bounding: number): number {
    return ((n - this._min) / (bounding - this._min)) * 100;
  }

  private _currentValue: number;
  private _max: number = 100;
  private _min: number = 0;
  private _boundingMax: number;
  private _boundingMin: number = 0;
}