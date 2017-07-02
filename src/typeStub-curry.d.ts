/* F<N> */
export type F1<T1, R> = (t1: T1) => R;
export type F2<T1, T2, R> = (t1: T1, t2: T2) => R;
export type F3<T1, T2, T3, R> = (t1: T1, t2: T2, t3: T3) => R;
export type F4<T1, T2, T3, T4, R> = (t1: T1, t2: T2, t3: T3, t4: T4) => R;
export type F5<T1, T2, T3, T4, T5, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R;
export type F6<T1, T2, T3, T4, T5, T6, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => R;
export type F7<T1, T2, T3, T4, T5, T6, T7, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => R;
export type F8<T1, T2, T3, T4, T5, T6, T7, T8, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => R;
export type F9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => R;
export type F10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10) => R;
export type F11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11) => R;
export type F12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12) => R;

/* CurryF<> */
export interface CurryF1<T1, R> extends Function {
  apply(thisArg: any, argArray: [T1]): R;

  (): CurryF1<T1, R>;

  (t1: T1): R;
}

export interface CurryF2<T1, T2, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2]): R;

  (): CurryF2<T1, T2, R>;

  (t1: T1): CurryF1<T2, R>;

  (t1: T1, t2: T2): R;
}

export interface CurryF3<T1, T2, T3, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3]): R;

  (): CurryF3<T1, T2, T3, R>;

  (t1: T1): CurryF2<T2, T3, R>;

  (t1: T1, t2: T2): CurryF1<T3, R>;

  (t1: T1, t2: T2, t3: T3): R;
}

export interface CurryF4<T1, T2, T3, T4, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4]): R;

  (): CurryF4<T1, T2, T3, T4, R>;

  (t1: T1): CurryF3<T2, T3, T4, R>;

  (t1: T1, t2: T2): CurryF2<T3, T4, R>;

  (t1: T1, t2: T2, t3: T3): CurryF1<T4, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): R;
}

export interface CurryF5<T1, T2, T3, T4, T5, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5]): R;

  (): CurryF5<T1, T2, T3, T4, T5, R>;

  (t1: T1): CurryF4<T2, T3, T4, T5, R>;

  (t1: T1, t2: T2): CurryF3<T3, T4, T5, R>;

  (t1: T1, t2: T2, t3: T3): CurryF2<T4, T5, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF1<T5, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
}

export interface CurryF6<T1, T2, T3, T4, T5, T6, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5, T6]): R;

  (): CurryF6<T1, T2, T3, T4, T5, T6, R>;

  (t1: T1): CurryF5<T2, T3, T4, T5, T6, R>;

  (t1: T1, t2: T2): CurryF4<T3, T4, T5, T6, R>;

  (t1: T1, t2: T2, t3: T3): CurryF3<T4, T5, T6, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF2<T5, T6, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): CurryF1<T6, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): R;
}

export interface CurryF7<T1, T2, T3, T4, T5, T6, T7, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5, T6, T7]): R;

  (): CurryF7<T1, T2, T3, T4, T5, T6, T7, R>;

  (t1: T1): CurryF6<T2, T3, T4, T5, T6, T7, R>;

  (t1: T1, t2: T2): CurryF5<T3, T4, T5, T6, T7, R>;

  (t1: T1, t2: T2, t3: T3): CurryF4<T4, T5, T6, T7, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF3<T5, T6, T7, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): CurryF2<T6, T7, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): CurryF1<T7, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): R;
}

export interface CurryF8<T1, T2, T3, T4, T5, T6, T7, T8, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5, T6, T7, T8]): R;

  (): CurryF8<T1, T2, T3, T4, T5, T6, T7, T8, R>;

  (t1: T1): CurryF7<T2, T3, T4, T5, T6, T7, T8, R>;

  (t1: T1, t2: T2): CurryF6<T3, T4, T5, T6, T7, T8, R>;

  (t1: T1, t2: T2, t3: T3): CurryF5<T4, T5, T6, T7, T8, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF4<T5, T6, T7, T8, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): CurryF3<T6, T7, T8, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): CurryF2<T7, T8, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): CurryF1<T8, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): R;
}

export interface CurryF9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5, T6, T7, T8, T9]): R;

  (): CurryF9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>;

  (t1: T1): CurryF8<T2, T3, T4, T5, T6, T7, T8, T9, R>;

  (t1: T1, t2: T2): CurryF7<T3, T4, T5, T6, T7, T8, T9, R>;

  (t1: T1, t2: T2, t3: T3): CurryF6<T4, T5, T6, T7, T8, T9, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF5<T5, T6, T7, T8, T9, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): CurryF4<T6, T7, T8, T9, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): CurryF3<T7, T8, T9, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): CurryF2<T8, T9, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): CurryF1<T9, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): R;
}

export interface CurryF10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]): R;

  (): CurryF10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>;

  (t1: T1): CurryF9<T2, T3, T4, T5, T6, T7, T8, T9, T10, R>;

  (t1: T1, t2: T2): CurryF8<T3, T4, T5, T6, T7, T8, T9, T10, R>;

  (t1: T1, t2: T2, t3: T3): CurryF7<T4, T5, T6, T7, T8, T9, T10, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF6<T5, T6, T7, T8, T9, T10, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): CurryF5<T6, T7, T8, T9, T10, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): CurryF4<T7, T8, T9, T10, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): CurryF3<T8, T9, T10, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): CurryF2<T9, T10, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): CurryF1<T10, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10): R;
}

export interface CurryF11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11]): R;

  (): CurryF11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>;

  (t1: T1): CurryF10<T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>;

  (t1: T1, t2: T2): CurryF9<T3, T4, T5, T6, T7, T8, T9, T10, T11, R>;

  (t1: T1, t2: T2, t3: T3): CurryF8<T4, T5, T6, T7, T8, T9, T10, T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF7<T5, T6, T7, T8, T9, T10, T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): CurryF6<T6, T7, T8, T9, T10, T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): CurryF5<T7, T8, T9, T10, T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): CurryF4<T8, T9, T10, T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): CurryF3<T9, T10, T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): CurryF2<T10, T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10): CurryF1<T11, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11): R;
}

export interface CurryF12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R> extends Function {
  apply(thisArg: any, argArray: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12]): R;

  (): CurryF12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>;

  (t1: T1): CurryF11<T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>;

  (t1: T1, t2: T2): CurryF10<T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3): CurryF9<T4, T5, T6, T7, T8, T9, T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4): CurryF8<T5, T6, T7, T8, T9, T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): CurryF7<T6, T7, T8, T9, T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): CurryF6<T7, T8, T9, T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): CurryF5<T8, T9, T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): CurryF4<T9, T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): CurryF3<T10, T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10): CurryF2<T11, T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11): CurryF1<T12, R>;

  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12): R;
}

/* curry() annotation */
declare function curry<T1, R>(f1: F1<T1, R>): CurryF1<T1, R>;
declare function curry<T1, T2, R>(f2: F2<T1, T2, R>): CurryF2<T1, T2, R>;
declare function curry<T1, T2, T3, R>(f3: F3<T1, T2, T3, R>): CurryF3<T1, T2, T3, R>;
declare function curry<T1, T2, T3, T4, R>(f4: F4<T1, T2, T3, T4, R>): CurryF4<T1, T2, T3, T4, R>;
declare function curry<T1, T2, T3, T4, T5, R>(f5: F5<T1, T2, T3, T4, T5, R>): CurryF5<T1, T2, T3, T4, T5, R>;
declare function curry<T1, T2, T3, T4, T5, T6, R>(f6: F6<T1, T2, T3, T4, T5, T6, R>): CurryF6<T1, T2, T3, T4, T5, T6, R>;
declare function curry<T1, T2, T3, T4, T5, T6, T7, R>(f7: F7<T1, T2, T3, T4, T5, T6, T7, R>): CurryF7<T1, T2, T3, T4, T5, T6, T7, R>;
declare function curry<T1, T2, T3, T4, T5, T6, T7, T8, R>(f8: F8<T1, T2, T3, T4, T5, T6, T7, T8, R>): CurryF8<T1, T2, T3, T4, T5, T6, T7, T8, R>;
declare function curry<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(f9: F9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>): CurryF9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>;
declare function curry<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>(f10: F10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>): CurryF10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>;
declare function curry<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>(f11: F11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>): CurryF11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>;
declare function curry<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>(f12: F12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>): CurryF12<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R>;

