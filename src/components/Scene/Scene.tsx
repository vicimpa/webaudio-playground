import { useEvent } from "hooks/useEvent";
import { useMoving } from "hooks/useMoving";
import { useWindowEvent } from "hooks/useWindowEvent";
import { minMax } from "library/math";
import { ReactiveSet } from "library/ReactiveSet";
import { FC, ReactNode, useEffect, useMemo, useRef } from "react";

import { SceneProvider, TLayer } from ".";
import styles from "./Scene.module.sass";

export type TSceneProps = {
  children?: ReactNode;
};

export const Scene: FC<TSceneProps> = ({ children }) => {
  const svg = useRef<SVGSVGElement>(null);
  const resize = useEvent(() => {
    const elem = svg?.current;
    if (!elem) return;

    const width = elem.clientWidth;
    const height = elem.clientHeight;

    const cWidth = width / 2;
    const cHeight = height / 2;

    elem.viewBox.baseVal.x = -cWidth / params.s + params.x;
    elem.viewBox.baseVal.y = -cHeight / params.s + params.y;
    elem.viewBox.baseVal.width = width / params.s;
    elem.viewBox.baseVal.height = height / params.s;
  });
  const observer = useMemo(() => new ResizeObserver(resize), []);
  const params = useRef({ x: 0, y: 0, s: 1 }).current;
  const layers = ReactiveSet.use<TLayer>();

  useEffect(() => {
    const elem = svg?.current;
    if (!elem) return;

    resize();
    observer.observe(elem);
    return () => observer.unobserve(elem);
  }, []);

  const moving = useMoving({
    params,
    start() {
      return {
        x: params.x,
        y: params.y
      };
    },
    moving(e, { x, y }) {
      const { dx, dy } = e;
      params.x = x - dx;
      params.y = y - dy;
      resize();
    }
  });

  useWindowEvent('wheel', (e) => {
    params.s = minMax(params.s + -e.deltaY * 0.003, .2, 5);
    resize();
  });

  const p10 = 16;
  const p100 = 128;

  const pre = [...layers].filter(e => e.isPre);
  const post = [...layers].filter(e => !e.isPre);

  return (
    <svg
      ref={svg}
      onMouseDown={moving}
      className={styles.scene}
    >
      <defs>
        <pattern id="p10" width={p10} height={p10} patternUnits="userSpaceOnUse">
          <path d={`M ${p10} 0 L 0 0 0 ${p10}`} fill="none" stroke="gray" strokeWidth={.5} />
        </pattern>
        <pattern id="p100" width={p100} height={p100} patternUnits="userSpaceOnUse">
          <rect width={p100} height={p100} fill="#333" />
          <rect width={p100} height={p100} fill="url(#p10)" />
          <path d={`M ${p100} 0 L 0 0 0 ${p100}`} fill="none" stroke="gray" strokeWidth={1} />
        </pattern>
      </defs>

      <rect x={-p100 * 50} y={-p100 * 50} width={p100 * 100} height={p100 * 100} fill="url(#p100)" />

      {pre.map((e, i) => (
        <g key={i} ref={e.ref} />
      ))}

      <SceneProvider value={{ params, svg, layers }}>
        {children}
      </SceneProvider>

      {post.map((e, i) => (
        <g key={i} ref={e.ref} />
      ))}
    </svg>
  );
};