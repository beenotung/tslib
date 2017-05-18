import {EventEmitter, Injectable, NgZone} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {BrowserXhr, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {createDefer} from './async';

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

export async function jsonReqToAsync<A>(o: Observable<Response>): Promise<A> {
  return ngObsToAsync<A>(
    o.mergeMap(res => res.json())
  );
}

export async function ngObsToAsync<A>(o: Observable<A>): Promise<A> {
  let defer = createDefer<any, A>();
  o.subscribe(a => defer.resolve(a), err => defer.reject(err));
  return defer.promise;
}
