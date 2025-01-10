---
title: 案例中的响应式state
description: 使用 createSignal 标记状态
---

```jsx
// 案例里面不要进行 import
// import { createSignal } from 'solid-js';
// import { Card } from 'n-code-live';

function Demo() {
  const [checked, setChecked] = createSignal<boolean>(false);
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
