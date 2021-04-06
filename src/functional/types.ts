export type Consumer<A> = (a: A) => void
export type Supplier<A> = () => A
export type AsyncSupplier<A> = () => Promise<A>
