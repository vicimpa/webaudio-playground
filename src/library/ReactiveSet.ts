import { useRerender } from "hooks/useRerender";
import { useLayoutEffect, useMemo } from "react";

export class ReactiveSet<T> extends Set<T> {
  #subs = new Set<(v: this) => any>();

  update() {
    for (const sub of this.#subs)
      sub(this);
  }

  add(value: T): this {
    super.add(value);
    this.update();
    return this;
  }

  delete(value: T): boolean {
    if (super.delete(value)) {
      this.update();
      return true;
    }
    return false;
  }

  clear(): void {
    super.clear();
    this.update();
    return;
  }

  subscribe(listener: (v: this) => any) {
    return (
      this.#subs.add(listener),
      () => { this.#subs.delete(listener); }
    );
  }

  use() {
    const rerender = useRerender();
    useLayoutEffect(() => this.subscribe(rerender));
    return this;
  }

  static use<T>(values?: readonly T[] | null) {
    return useMemo(() => new this(values), []).use();
  }
}