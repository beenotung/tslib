export type Consumer<A> = (a: A) => void
export type Supplier<A> = () => A

/** @deprecated*/
export type AsyncSupplier<A> = () => Promise<A>
