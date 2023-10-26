import { FC } from "react";

import styles from "./Node.module.sass";

export type TConnector = {
  type?: 'in' | 'out';
  title?: string;
  color?: string;
};

export type TConnectorProps = {
  conn: TConnector;
};

export const Connector: FC<TConnectorProps> = ({
  conn: {
    type = 'out',
    title =
    type,
    color = '#f99'
  }
}) => {

  return (
    <span
      className={styles.connector}
      data-type={type}
      style={{ ['--color']: color } as any}
    >
      {title}
    </span>
  );
};