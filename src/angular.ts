import {Component, EventEmitter, Injectable} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Type} from "./lang";
import {ControlValueAccessor} from "@angular/forms";
import {BrowserXhr} from "@angular/http";

/**
 * for the sake of type check on the param
 * */
export interface ParabledPage<IParam> extends Component {
  paramData: IParam;
}
export function navPushPage<IParam>(navCtrl: NavController, page: Type<ParabledPage<IParam>>, param?: IParam, done?: Function) {
  return navCtrl.push(page, param, {}, done);
}

export declare class TypedNavParams<A> extends NavParams {
  data: A;

  get<B>(param: string): B;
}
export function typedNavParams<A>(navParams: NavParams): TypedNavParams<A> {
  return navParams;
}

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
