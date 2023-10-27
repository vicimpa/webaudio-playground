import { useMoving } from "hooks/useMoving";
import { useProxyState } from "hooks/useProxyState";
import { ReactiveSet } from "library/ReactiveSet";
import { createContext, FC, ReactNode, useContext, useEffect, useId, useLayoutEffect, useRef } from "react";

import { Connector, TConnector } from ".";
import styles from "./Node.module.sass";

export type TNodeProps = {
  x?: number;
  y?: number;
  title?: string;
  children?: ReactNode;

  onSelect?(): any;
  onDragStart?(x: number, y: number): any;
  onDragMoving?(x: number, y: number): any;
  onDragEnd?(x: number, y: number): any;
};

const NodeContext = createContext<ReactiveSet<TConnector> | null>(null);

export const registerConnector = (conn: TConnector) => {
  const list = useContext(NodeContext);
  const object = useRef(conn);

  Object.assign(object.current, conn);

  useLayoutEffect(() => (
    list?.add(conn),
    () => { list?.delete(conn); }
  ));
};

export const Node: FC<TNodeProps> = ({
  x = 0,
  y = 0,
  title = 'Unnamed node',
  children,
  ...events
}) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const pos = useProxyState({ x, y });
  const size = useProxyState({ width: 0, height: 0 });
  const padding = 10;
  const connectors = ReactiveSet.use<TConnector>();

  useEffect(() => {
    const elem = ref.current;
    const resize = () => {
      if (!elem) return;
      size.width = elem.offsetWidth + padding * 2;
      size.height = elem.offsetHeight + padding * 2;
    };

    const observer = new ResizeObserver(resize);
    resize();
    if (elem) observer.observe(elem);

    return () => {
      observer.disconnect();
    };
  }, []);

  const moving = useMoving({
    start() {
      events.onDragStart?.(pos.x, pos.y);
      return {
        x: pos.x,
        y: pos.y
      };
    },
    moving({ dx, dy }, { x, y }) {
      pos.x = x + dx;
      pos.y = y + dy;
      events.onDragMoving?.(pos.x, pos.y);
    },
    end() {
      events.onDragEnd?.(pos.x, pos.y);
    }
  });

  const left = [...connectors].filter(e => e.type === 'in');
  const right = [...connectors].filter(e => e.type === 'out');

  return (
    <foreignObject
      x={pos.x - size.width / 2}
      y={pos.y - size.height / 2}
      width={size.width}
      height={size.height}
      onMouseDown={e => { e.stopPropagation(); events.onSelect?.(); }}
    >
      <div className={styles.fake} style={{ padding }}>
        <div ref={ref} className={styles.container}>
          <div
            onMouseDown={moving}
            className={styles.title}
          >
            {title}
          </div>
          <div className={styles.content}>
            {!left.length ? null : (
              <div className={styles.left}>
                {left.map((conn, i) => (
                  <Connector id={id} conn={conn} key={i} />
                ))}
              </div>
            )}
            <div className={styles.center}>
              <NodeContext.Provider value={connectors}>
                {children}
              </NodeContext.Provider>
            </div>
            {!right.length ? null : (
              <div className={styles.right}>
                {right.map((conn, i) => (
                  <Connector id={id} conn={conn} key={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </foreignObject>
  );
};