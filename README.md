# n-code-live

> Code Live for webcomponent

**[Demo](https://monako97.github.io/neko-ui/)**

**[Docs](https://monako97.github.io/neko-ui/)**

```html
<div style="display:flex;gap:24px;">
  <div style="flex:1;">
    <h2>渲染html:</h2>
    <n-code-live class="html" jsx="false"></n-code-live>
    <textarea
      id="html-input"
      placeholder="html"
      style="width:100%;height: 400px;"
    ></textarea>
  </div>
  <div style="flex:1;">
    <h2>渲染jsx:</h2>
    <n-code-live class="jsx" jsx="true"></n-code-live>
    <textarea
      id="jsx-input"
      placeholder="jsx"
      style="width:100%;height: 400px;"
    ></textarea>
  </div>
</div>
<script type="text/javascript">
  const htmlLive = document.querySelector(".html");
  const jsxLive = document.querySelector(".jsx");
  const htmlText = document.querySelector("#html-input");
  const jsxText = document.querySelector("#jsx-input");

  htmlText.value = `<p style="color:red;">这是渲染的html标sacsacsas签</p>
<script>
  // 使用 container 来获取渲染容器, 你可以使用这个来进行 dom 脚本操作
  const el = container.querySelector('p');
  let flag = false;

  console.log('还支持script标签', el);

  // 你也可以写 JSX 语法, 比如箭头函数
  setInterval(() => {
    el.style.color = flag ? 'red' : 'blue';
    flag = !flag;
  }, 1000);
    <\/script>`;

  htmlLive.source = htmlText.value;
  jsxText.value = `
// 支持 ts
let el: HTMLElement | null = null;
let flag = false;

createEffect(() => {
  console.log("还支持ts", el);
});

// 你也可以写 JSX 语法, 比如箭头函数
setInterval(() => {
  if (el) {
    el.style.color = flag ? "red" : "blue";
  }
  flag = !flag;
}, 1000);

render(
  <>
    <p
      ref={(e) => (el = e)}
      style={{
        color: "red",
      }}
    >
      这是渲染的jsx标签
    </p>
    <p
      style={{
        color: "red",
      }}
    >
      这是渲染的jsx标签
    </p>
  </>
);
    `;

  jsxLive.source = jsxText.value;
  function setJSX(e) {
    jsxLive.source = e.target.value;
  }
  jsxText.addEventListener("change", setJSX);

  htmlText.addEventListener("input", function (e) {
    htmlLive.source = e.target.value;
  });
</script>
```

## API

| 属性      | 说明                       | 类型              | 默认值  | 版本 |
| --------- | -------------------------- | ----------------- | ------- | ---- |
| jsx       | 是否为 jsx 语法            | `boolean`         | `false` | -    |
| source    | 需要渲染的代码             | `string`          | -       | -    |
| scope     | 需要插入到代码中的局部变量 | `MDXComponents`   | -       | -    |
| transform | 代码配置项                 | `TransformOption` | -       | -    |
