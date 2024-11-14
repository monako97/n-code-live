import type { CodeLiveElement } from "..";
import * as SolidJS from "solid-js";
import { render } from "solid-js/web";
import h from "solid-js/h";
import "../src";

document.body.innerHTML = `
<div style="display:flex;gap:24px;">
    <div style="flex:1;">
        <h2>渲染html:</h2>
        <n-code-live shadow="false" class="html" jsx="false"></n-code-live>
        <textarea id="html-input" placeholder="html" style="width:100%;height: 400px;"></textarea>
    </div>
    <div style="flex:1;">
        <h2>渲染jsx:</h2>
        <n-code-live class="jsx" jsx="true"></n-code-live>
        <textarea id="jsx-input" placeholder="jsx" style="width:100%;height: 400px;"></textarea>
    </div>
</div>
`;

const htmlLive = document.querySelector(".html") as CodeLiveElement;
const jsxLive = document.querySelector(".jsx") as CodeLiveElement;
const htmlText = document.querySelector("#html-input") as HTMLInputElement;
const jsxText = document.querySelector("#jsx-input") as HTMLInputElement;

htmlText.value = `<p style="color:red;">这是渲染的html标签</p>
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
</script>`;

htmlLive.source = htmlText.value;

function jsx(
  type: SolidJS.Component,
  p: SolidJS.VoidProps,
  ...children: SolidJS.JSXElement[]
) {
  return h(type, {
    ...p,
    children,
  });
}
function Fragment(p: SolidJS.VoidProps) {
  return p.children;
}

jsxLive.components = {
  jsx: jsx,
  Fragment: Fragment,
  ...SolidJS,
};
jsxLive.renderJsx = render;
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
  <p
    ref={(e) => (el = e)}
    style={{
      color: "red",
    }}
  >
      这是渲染的jsx标签
    </p>
);
`;

jsxLive.source = jsxText.value;

jsxText?.addEventListener("input", function (e) {
  jsxLive.source = (e.target as HTMLInputElement).value;
});

htmlText?.addEventListener("input", function (e) {
  htmlLive.source = (e.target as HTMLInputElement).value;
});
