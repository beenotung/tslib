/**
 * Created by beenotung on 12/26/16.
 */

export type Consumer<A>=(a: A) => void;
export type Supplier<A>=() => A;
