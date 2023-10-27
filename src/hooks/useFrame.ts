import { useLayoutEffect } from "react";

import { useEvent } from "./useEvent";

export type TListener = (dtime: number, time: number) => any;

const subs = new Set<TListener>();

let lastTime = -1;
let dtime = 0;

export const run = <T extends TListener>(listener: T): ReturnType<T> => {
  return listener(dtime, lastTime);
};

const loop = (time: number, list: TListener[] | Set<TListener> = subs) => {
  requestAnimationFrame(loop);

  dtime = time - lastTime;
  lastTime = time;

  if (lastTime === -1)
    return;

  for (const sub of list) {
    try { run(sub); }
    catch (e) { console.error(e); }
  }
};

requestAnimationFrame(loop);

export const useFrame = (listener: TListener) => {
  const eventListener = useEvent(listener);

  if (!subs.has(listener))
    subs.add(eventListener);

  useLayoutEffect(() => {
    return () => {
      subs.delete(eventListener);
    };
  }, []);
};