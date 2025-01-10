---
title: 多种语法
description: 为当前案例提供多种语法的代码
order: 2
---

```tsx
import { createSignal } from 'solid-js';
import { Card } from 'n-code-live';

function Demo() {
  const [checked, setChecked] = createSignal<boolean>(false);
  const Title = () => <span>自定义标题{checked() ? '开' : '关'}</span>;
  const Child = () => <span>{checked() ? '开' : '关'}</span>;

  return (
    <>
      <n-switch checked={checked()} onChange={(e) => setChecked(e.detail)} />
      <Card title={Title}>
        <Child />
      </Card>
    </>
  );
}

export default Demo;
```

```jsx
function Demo() {
  const [checked, setChecked] = createSignal(false);
  const title = () => <span>自定义标题{checked() ? '开' : '关'}</span>;
  const child = () => <span>{checked() ? '开' : '关'}</span>;

  return (
    <>
      <n-switch checked={checked()} onChange={(e) => setChecked(e.detail)} />
      <Card title={title}>{child}</Card>
    </>
  );
}
```

```html
<span>不好意思不支持html</span>
```
