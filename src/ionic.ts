import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Type} from './lang';

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