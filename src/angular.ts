import {NgZone} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {createDefer} from './async';

/**
 * to usage [(ngModel)] directly
 * */
export class CommonControlValueAccessor<T> implements ControlValueAccessor {
  protected innerValue: T;

  get value(): T {
    return this.innerValue;
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

  registerOnChange(fn: (event: any) => void): void {
    this.onChangeCallback = fn;
    fn(this.innerValue);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }
}

export async function ngRunLater(ngZone: NgZone, f?: () => void, delay = 0) {
  const defer = createDefer();
  setTimeout(() => {
    if (f) {
      ngZone.run(() => {
        f();
        defer.resolve(void 0);
      });
    } else {
      ngZone.run(() => defer.resolve(void 0));
    }
  }, delay);
  return defer.promise;
}

export async function ngObsToAsync<A>(o: Observable<A>): Promise<A> {
  const defer = createDefer<any, A>();
  o.subscribe(a => defer.resolve(a), (err: any) => defer.reject(err));
  return defer.promise;
}
