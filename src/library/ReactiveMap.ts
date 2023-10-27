import { useRerender } from "hooks/useRerender";
import { useLayoutEffect, useMemo } from "react";

export class ReactiveMap<K, V> extends Map<K, V> {
  #subs = new Set<(v: this) => any>();

  update() {
    for (const sub of this.#subs)
      sub(this);
  }

  set(key: K, value: V): this {
    super.set(key, value);
    this.update();
    return this;
  }

  delete(key: K): boolean {
    if (super.delete(key)) {
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

  static use<K, V>(entries?: readonly (readonly [K, V])[] | null) {
    return useMemo(() => new this(entries), []).use();
  }
}