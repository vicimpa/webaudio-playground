import { useSceneConverter, useSceneParams } from "components/Scene";
import { MouseEventHandler, useRef } from "react";

import { useEvent } from "./useEvent";
import { useWindowEvent } from "./useWindowEvent";

export interface IMoving<T extends (object | void)> {
  params?: { s: number; };
  start?(e: IMovingEvent): T;
  moving?(e: IMovingEvent, meta: T): any;
  end?(e: IMovingEvent, meta: T): any;
}

export interface IMovingEvent {
  x: number;
  y: number;
  dx: number;
  dy: number;
  down: boolean;
}

export const useMoving = <T extends (object | void)>({
  params = useSceneParams(),
  start = () => { return {} as T; },
  moving = () => { },
  end = () => { },
}: IMoving<T>): MouseEventHandler => {
  const startPoint = useRef({ x: 0, y: 0 });
  const refMeta = useRef<T>();
  const refState = useRef<IMovingEvent>({ x: 0, y: 0, dx: 0, dy: 0, down: false });
  const eventStart = useEvent(start);
  const eventMoving = useEvent(moving);
  const eventEnd = useEvent(end);
  const glob2map = useSceneConverter();

  useWindowEvent('mousemove', (e) => {
    if (!refState.current.down) return;
    const { x, y } = startPoint.current;
    const point = glob2map(e.clientX, e.clientY);
    refState.current.x = point.x;
    refState.current.y = point.y;
    refState.current.dx = (e.clientX - x) / params.s;
    refState.current.dy = (e.clientY - y) / params.s;
    eventMoving(refState.current, refMeta.current!);
  });

  useWindowEvent('mouseup', () => {
    if (!refState.current.down) return;
    refState.current.down = false;
    eventEnd(refState.current, refMeta.current!);
  });

  return useEvent<MouseEventHandler>((e) => {
    if (e.button) return;
    e.preventDefault();
    refState.current.down = true;
    const point = glob2map(e.clientX, e.clientX);
    startPoint.current.x = e.clientX;
    startPoint.current.y = e.clientY;
    refState.current.x = point.x;
    refState.current.y = point.y;
    refState.current.dx = 0;
    refState.current.dy = 0;
    refMeta.current = eventStart(refState.current);
  });
};