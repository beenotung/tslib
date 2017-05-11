import {EventEmitter, Injectable, NgZone} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {BrowserXhr} from '@angular/http';

/**
 * to usage [(ngModel)] directly
 * */
export class CommonControlValueAccessor<T> implements ControlValueAccessor {
  private innerValue: T;

  get value(): T {
    return this.innerValue
  }

  set value(v: T) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(obj: T): void {
    if (obj !== this.innerValue) {
      this.innerValue = obj;
    }
  }

  onChangeCallback(event: any): void {
  }

  onTouchedCallback(): void {
  }

  onBlur() {
    this.onTouchedCallback();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
    fn(this.innerValue);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
}

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {
  static progressEventEmitter = new EventEmitter<ProgressEvent>();

  constructor() {
    super()
  }

  build(): any {
    let xhr = super.build();
    xhr.onprogress = (event: any) => {
      CustomBrowserXhr.progressEventEmitter.emit(event);
    };
    return <any>(xhr);
  }
}

export function ngRunLater(ngZone: NgZone, f: () => void) {
  setTimeout(() => ngZone.run(f));
}
