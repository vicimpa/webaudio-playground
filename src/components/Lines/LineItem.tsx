import { elementCenter } from "library/elementCenter";
import { Component, ReactNode } from "react";

export type TLineOptions = {
  from?: string | { x: number; y: number; };
  to?: string | { x: number; y: number; };
  color?: string;
};

export class LineItem extends Component<{ line: TLineOptions; }> {
  from?: Element | { x: number; y: number; };
  to?: Element | { x: number; y: number; };
  color?: string;

  fromPos?: { x: number; y: number; };
  toPos?: { x: number; y: number; };

  mounted = false;

  update() {
    if (!this.mounted) return;
    requestAnimationFrame(() => this.update());
    const { line } = this.props;

    if (!line.from) return;
    if (!line.to) return;

    if (typeof line.from === 'string')
      this.from = document.getElementById(line.from) ?? undefined;
    else
      this.from = line.from;

    if (typeof line.to === 'string')
      this.to = document.getElementById(line.to) ?? undefined;
    else
      this.to = line.to;

    if (!this.from) return;
    if (!this.to) return;

    if (this.from instanceof Element)
      this.fromPos = elementCenter(this.from);
    else if ('x' in this.from && 'y' in this.from)
      this.fromPos = this.from;

    if (this.to instanceof Element)
      this.toPos = elementCenter(this.to);
    else if ('x' in this.to && 'y' in this.to)
      this.toPos = this.to;

    if (!this.fromPos) return;
    if (!this.toPos) return;

    console.log(this.fromPos, this.toPos);
  }

  componentDidMount(): void {
    this.mounted = true;
    requestAnimationFrame(() => this.update());
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  render(): ReactNode {
    return (
      <></>
    );
  }
};