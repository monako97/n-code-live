---
title: 顶级中具有多个组件
description: 在一个案例中创建多个组件使用, 需要调用 `render` 进行手动渲染
col: '100%'
---

```jsx
// 案例里面不要进行 import
// import { createSignal } from 'solid-js';
// import { Card } from 'n-code-live';

interface ChildProps {
  checked?: boolean;
}

const Title = (props: ChildProps) => {
  return <span>自定义标题{props.checked ? '开' : '关'}</span>;
};

const Child = (props: ChildProps) => {
  return <span>{props.checked ? '开' : '关'}</span>;
};

function Demo() {
  const [checked, setChecked] = createSignal(false);
  const title = () => <Title checked={checked()} />;
  const child = () => <Child checked={checked()} />;

  return (
    <>
      <n-switch checked={checked()} onChange={(e) => setChecked(e.detail)} />
      <Card title={title}>{child}</Card>
    </>
  );
}

// 手动render
render(<Demo />);
```
