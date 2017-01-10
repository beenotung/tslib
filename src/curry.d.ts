/* F<N> */
export type F1<T1,R> = (t1: T1) => R;
export type F2<T1,T2,R> = (t1: T1, t2: T2) => R;
export type F3<T1,T2,T3,R> = (t1: T1, t2: T2, t3: T3) => R;
export type F4<T1,T2,T3,T4,R> = (t1: T1, t2: T2, t3: T3, t4: T4) => R;
export type F5<T1,T2,T3,T4,T5,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R;
export type F6<T1,T2,T3,T4,T5,T6,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => R;
export type F7<T1,T2,T3,T4,T5,T6,T7,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => R;
export type F8<T1,T2,T3,T4,T5,T6,T7,T8,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => R;
export type F9<T1,T2,T3,T4,T5,T6,T7,T8,T9,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => R;
export type F10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10) => R;
export type F11<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11) => R;
export type F12<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12) => R;

/* CurryF<> */
export type CurryF1<T1,R> =
  () => CurryF1<T1,R>
    | F1<T1,R>
  ;
export type CurryF2<T1,T2,R> =
  () => CurryF2<T1,T2,R>
    | F1<T1,CurryF1<T2, R>>
    | F2<T1,T2,R>
  ;
export type CurryF3<T1,T2,T3,R> =
  () => CurryF3<T1,T2,T3,R>
    | F1<T1,CurryF2<T2,T3, R>>
    | F2<T1,T2,CurryF1<T3, R>>
    | F3<T1,T2,T3,R>
  ;
export type CurryF4<T1,T2,T3,T4,R> =
  () => CurryF4<T1,T2,T3,T4,R>
    | F1<T1,CurryF3<T2,T3,T4, R>>
    | F2<T1,T2,CurryF2<T3,T4, R>>
    | F3<T1,T2,T3,CurryF1<T4, R>>
    | F4<T1,T2,T3,T4,R>
  ;
export type CurryF5<T1,T2,T3,T4,T5,R> =
  () => CurryF5<T1,T2,T3,T4,T5,R>
    | F1<T1,CurryF4<T2,T3,T4,T5, R>>
    | F2<T1,T2,CurryF3<T3,T4,T5, R>>
    | F3<T1,T2,T3,CurryF2<T4,T5, R>>
    | F4<T1,T2,T3,T4,CurryF1<T5, R>>
    | F5<T1,T2,T3,T4,T5,R>
  ;
export type CurryF6<T1,T2,T3,T4,T5,T6,R> =
  () => CurryF6<T1,T2,T3,T4,T5,T6,R>
    | F1<T1,CurryF5<T2,T3,T4,T5,T6, R>>
    | F2<T1,T2,CurryF4<T3,T4,T5,T6, R>>
    | F3<T1,T2,T3,CurryF3<T4,T5,T6, R>>
    | F4<T1,T2,T3,T4,CurryF2<T5,T6, R>>
    | F5<T1,T2,T3,T4,T5,CurryF1<T6, R>>
    | F6<T1,T2,T3,T4,T5,T6,R>
  ;
export type CurryF7<T1,T2,T3,T4,T5,T6,T7,R> =
  () => CurryF7<T1,T2,T3,T4,T5,T6,T7,R>
    | F1<T1,CurryF6<T2,T3,T4,T5,T6,T7, R>>
    | F2<T1,T2,CurryF5<T3,T4,T5,T6,T7, R>>
    | F3<T1,T2,T3,CurryF4<T4,T5,T6,T7, R>>
    | F4<T1,T2,T3,T4,CurryF3<T5,T6,T7, R>>
    | F5<T1,T2,T3,T4,T5,CurryF2<T6,T7, R>>
    | F6<T1,T2,T3,T4,T5,T6,CurryF1<T7, R>>
    | F7<T1,T2,T3,T4,T5,T6,T7,R>
  ;
export type CurryF8<T1,T2,T3,T4,T5,T6,T7,T8,R> =
  () => CurryF8<T1,T2,T3,T4,T5,T6,T7,T8,R>
    | F1<T1,CurryF7<T2,T3,T4,T5,T6,T7,T8, R>>
    | F2<T1,T2,CurryF6<T3,T4,T5,T6,T7,T8, R>>
    | F3<T1,T2,T3,CurryF5<T4,T5,T6,T7,T8, R>>
    | F4<T1,T2,T3,T4,CurryF4<T5,T6,T7,T8, R>>
    | F5<T1,T2,T3,T4,T5,CurryF3<T6,T7,T8, R>>
    | F6<T1,T2,T3,T4,T5,T6,CurryF2<T7,T8, R>>
    | F7<T1,T2,T3,T4,T5,T6,T7,CurryF1<T8, R>>
    | F8<T1,T2,T3,T4,T5,T6,T7,T8,R>
  ;
export type CurryF9<T1,T2,T3,T4,T5,T6,T7,T8,T9,R> =
  () => CurryF9<T1,T2,T3,T4,T5,T6,T7,T8,T9,R>
    | F1<T1,CurryF8<T2,T3,T4,T5,T6,T7,T8,T9, R>>
    | F2<T1,T2,CurryF7<T3,T4,T5,T6,T7,T8,T9, R>>
    | F3<T1,T2,T3,CurryF6<T4,T5,T6,T7,T8,T9, R>>
    | F4<T1,T2,T3,T4,CurryF5<T5,T6,T7,T8,T9, R>>
    | F5<T1,T2,T3,T4,T5,CurryF4<T6,T7,T8,T9, R>>
    | F6<T1,T2,T3,T4,T5,T6,CurryF3<T7,T8,T9, R>>
    | F7<T1,T2,T3,T4,T5,T6,T7,CurryF2<T8,T9, R>>
    | F8<T1,T2,T3,T4,T5,T6,T7,T8,CurryF1<T9, R>>
    | F9<T1,T2,T3,T4,T5,T6,T7,T8,T9,R>
  ;
export type CurryF10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,R> =
  () => CurryF10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,R>
    | F1<T1,CurryF9<T2,T3,T4,T5,T6,T7,T8,T9,T10, R>>
    | F2<T1,T2,CurryF8<T3,T4,T5,T6,T7,T8,T9,T10, R>>
    | F3<T1,T2,T3,CurryF7<T4,T5,T6,T7,T8,T9,T10, R>>
    | F4<T1,T2,T3,T4,CurryF6<T5,T6,T7,T8,T9,T10, R>>
    | F5<T1,T2,T3,T4,T5,CurryF5<T6,T7,T8,T9,T10, R>>
    | F6<T1,T2,T3,T4,T5,T6,CurryF4<T7,T8,T9,T10, R>>
    | F7<T1,T2,T3,T4,T5,T6,T7,CurryF3<T8,T9,T10, R>>
    | F8<T1,T2,T3,T4,T5,T6,T7,T8,CurryF2<T9,T10, R>>
    | F9<T1,T2,T3,T4,T5,T6,T7,T8,T9,CurryF1<T10, R>>
    | F10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,R>
  ;
export type CurryF11<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,R> =
  () => CurryF11<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,R>
    | F1<T1,CurryF10<T2,T3,T4,T5,T6,T7,T8,T9,T10,T11, R>>
    | F2<T1,T2,CurryF9<T3,T4,T5,T6,T7,T8,T9,T10,T11, R>>
    | F3<T1,T2,T3,CurryF8<T4,T5,T6,T7,T8,T9,T10,T11, R>>
    | F4<T1,T2,T3,T4,CurryF7<T5,T6,T7,T8,T9,T10,T11, R>>
    | F5<T1,T2,T3,T4,T5,CurryF6<T6,T7,T8,T9,T10,T11, R>>
    | F6<T1,T2,T3,T4,T5,T6,CurryF5<T7,T8,T9,T10,T11, R>>
    | F7<T1,T2,T3,T4,T5,T6,T7,CurryF4<T8,T9,T10,T11, R>>
    | F8<T1,T2,T3,T4,T5,T6,T7,T8,CurryF3<T9,T10,T11, R>>
    | F9<T1,T2,T3,T4,T5,T6,T7,T8,T9,CurryF2<T10,T11, R>>
    | F10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,CurryF1<T11, R>>
    | F11<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,R>
  ;
export type CurryF12<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,R> =
  () => CurryF12<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,R>
    | F1<T1,CurryF11<T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12, R>>
    | F2<T1,T2,CurryF10<T3,T4,T5,T6,T7,T8,T9,T10,T11,T12, R>>
    | F3<T1,T2,T3,CurryF9<T4,T5,T6,T7,T8,T9,T10,T11,T12, R>>
    | F4<T1,T2,T3,T4,CurryF8<T5,T6,T7,T8,T9,T10,T11,T12, R>>
    | F5<T1,T2,T3,T4,T5,CurryF7<T6,T7,T8,T9,T10,T11,T12, R>>
    | F6<T1,T2,T3,T4,T5,T6,CurryF6<T7,T8,T9,T10,T11,T12, R>>
    | F7<T1,T2,T3,T4,T5,T6,T7,CurryF5<T8,T9,T10,T11,T12, R>>
    | F8<T1,T2,T3,T4,T5,T6,T7,T8,CurryF4<T9,T10,T11,T12, R>>
    | F9<T1,T2,T3,T4,T5,T6,T7,T8,T9,CurryF3<T10,T11,T12, R>>
    | F10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,CurryF2<T11,T12, R>>
    | F11<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,CurryF1<T12, R>>
    | F12<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,R>
  ;

