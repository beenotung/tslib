import {EventEmitter, Injectable, NgZone} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";
import {BrowserXhr} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {createDefer} from "./async";

/**
 * to usage [(ngModel)] directly
 * */
export class CommonControlValueAccessor<T> implements ControlValueAccessor {
  protected innerValue: T;

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
  let defer = createDefer<any, A>();
  o.subscribe(a => defer.resolve(a), err => defer.reject(err));
  return defer.promise;
}
