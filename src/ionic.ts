import {Component} from "@angular/core";
import {NavController, NavParams, Platform} from "ionic-angular";
import {Type} from "./lang";
import {enum_only_string} from "./enum";

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

export enum AppType {
  web, android, ios, windows,
}

enum_only_string(AppType);

export function getAppType(platform: Platform): AppType {
  return platform.is("mobileweb") ? AppType.web
    : platform.is("android") ? AppType.android
      : platform.is("ios") ? AppType.ios
        : platform.is("windows") ? AppType.windows
          : (() => {
            throw new TypeError("unknown platform");
          })();
}
