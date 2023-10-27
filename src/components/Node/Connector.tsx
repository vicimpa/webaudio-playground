import { useSceneConverter } from "components/Scene";
import { useMoving } from "hooks/useMoving";
import { FC, useId, useRef } from "react";

import styles from "./Node.module.sass";

export type TConnector = {
  type?: 'in' | 'out';
  title?: string;
  color?: string;
  multiply?: boolean;
};

export type TConnectorProps = {
  id: string;
  conn: TConnector;
};

export const Connector: FC<TConnectorProps> = ({
  id,
  conn: {
    type = 'out',
    title = type,
    color = '#f99'
  }
}) => {
  const addId = useId();
  const point = useRef<HTMLElement>(null);
  const convert = useSceneConverter();

  const moving = useMoving({
    start() {
      const pt = point.current;
      if (!pt) return undefined;
      const { x, y, width, height } = pt.getBoundingClientRect();
      return convert(x + width / 2, y + height / 2);
    },
    moving(e, meta) {
      if (!meta) return;
      meta.x + e.dx;
      meta.y + e.dy;
    },
    end() {
    }
  });

  return (
    <>
      <span
        onMouseDown={moving}
        className={styles.connector}
        data-type={type}
        style={{ ['--color']: color } as any}
      >
        <i id={`${id}-${addId}`} ref={point} className={styles.point} />
        {title}
      </span>
    </>
  );
};