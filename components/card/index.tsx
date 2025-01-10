import { type Component, type JSXElement, Show } from 'solid-js';

/** API
 * @since 1.0.0
 * @author monako97 <poi.nyaa@qq.com>
 */
export interface CardProps {
  /** 标题
   * @default 默认值
   * @since 1.1.0 <br />表示这个属性在 1.1.0 新增
   */
  title?: Component;
  /** 内容 */
  children: JSXElement;
  /** 尺寸
   * @default 'normal'
   */
  size?: keyof typeof Size;
  /** 类型
   * @default 'line'
   */
  type?: keyof typeof Type;
}

/** 对于字面量建议使用枚举 */
export enum Size {
  /** 小 */
  small,
  /** 默认 */
  normal,
}
/** 类型 */
export enum Type {
  /** 线 */
  line = 'line',
  /** 卡片 */
  card = 'card',
}
function Card(props: CardProps) {
  return (
    <div>
      <h4>
        <Show when={props.title}>{props.title}</Show>
      </h4>
      <div>{props.children}</div>
    </div>
  );
}

export default Card;
