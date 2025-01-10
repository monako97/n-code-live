---
title: 最简单的用法 (推荐)
description: 最简单的用法、order为当前案例排序、col为所占宽度
order: 0
col: 50%
---

```html
<span>直接写html</span>
<script>
    // 在这里你可以写 javasctipt
    console.log('hello html!');
    // container 是案例的根容器, 你可以通过它来查找 dom
    const el = container.querySelector('span');

    el.style.color = 'red';
</script>
```

```jsx
<span>直接写JSX标签</span>
<Card title={<span>Card的自定义标题</span>} />
```
