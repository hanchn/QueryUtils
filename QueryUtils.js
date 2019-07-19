// 阉割版的JQuery
class QueryUtils {
  state = {};
  constructor() {
    super();
  }

  // 绑定dom
  $ = (target = null) => {
    if (target == null) return;
    let { fade, getAttr, getStyle, bind, css, addClass, html, text } = this;

    let root = document.querySelector(target);
    let style = getStyle({ root });
    root.show = (time = 0) => fade({ style, root, time });
    root.hide = (time = 0) => fade({ style, root, time, show: false });
    root.width = getAttr({ attr: "width", root });
    root.height = getAttr({ attr: "height", root });
    root.top = getAttr({ attr: "top", root });
    root.right = getAttr({ attr: "right", root });
    root.down = getAttr({ attr: "down", root });
    root.left = getAttr({ attr: "left", root });
    root.bind = (event, res) => bind({ root, eType: event, res });
    root.bindClear = (event, res) => bind({ root, eType: event });
    root.addClass = className => addClass({ root, className });
    root.html = template => () =>
      html({
        root,
        template
      });
    root.text = template => () =>
      text({
        root,
        template
      });
    root.css = styles =>
      css({
        root,
        styles,
        style
      });
    return root;
  };

  // 获取当前的样式
  getStyle = ({ root }) => {
    let style = null;
    (style = root.getAttribute("style")) == null ? "" : style;
    return style == null ? "" : style;
  };

  // 显示隐藏DOM
  fade = ({ style = null, root = null, show = true, time }) => {
    let setTimer = setTimeout(() => {
      if (style == null || root == null) return;
      root.style = style + `display: ${show ? "block" : "none"};`;
      clearTimeout(setTimer);
      return root;
    });
  };

  addClass = ({ root, className }) => {
    let oldClassName = root.getAttribute("class");
    root.setAttribute(
      "class",
      (oldClassName ? oldClassName + " " : "") + className
    );
    return root;
  };

  // 获取DOM的宽高
  getAttr = ({ attr = null, root }) => {
    if (attr == null) return;
    switch (attr) {
      case "width":
        return root.offsetWidth;
      case "height":
        return root.offsetHeight;
      case "top":
        return root.offsetTop;
      case "right":
        return root.offsetRight;
      case "down":
        return root.offsetDown;
      case "left":
        return root.offsetLeft;
      default:
        break;
    }
  };

  // css
  css = ({ root, styles, style }) => {
    let styleSnippets = style;
    if (!styles) return;
    Object.keys(styles).map(v => {
      styleSnippets += `${v}: ${styles[v]};`;
    });
    root.style = styleSnippets;
    return root;
  };

  // 事件绑定
  bind = ({ root = window, eType = "click", res }) => {
    root.addEventListener(eType, res);
    return root;
  };

  // 事件清除
  bindClear = ({ root = window, eType = "click" }) => {
    root.removeEventListener(eType);
    return root;
  };

  // 获取最新的window参数
  getWindowState = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scrollTop: window.screenTop,
    scrollLeft: window.scrollLeft
  });

  // 创建DOM
  createEl = ({ attr = {}, root = null, length = 1 }) => {
    let rootDom = document.querySelector(root == null ? "body" : root);
    let empList = [];
    for (let i = 0; i < length; i++) {
      const createDom = document.createElement("div");
      empList = [...empList, createDom];
      if (attr !== {}) {
        Object.keys(attr).map(v => {
          if (v == "style") {
            let { css } = this;
            css({ root: createDom, styles: attr[v], style: "" });
          } else if (v == "html") {
            let { html } = this;
            html({ root: createDom, template: attr[v] });
          } else if (v == "text") {
            let { text } = this;
            html({ root: createDom, template: attr[v] });
          } else {
            createDom.setAttribute(v, attr[v]);
          }
        });
      }
      rootDom.appendChild(createDom);
    }
    if (length == 1) {
      return empList[0];
    } else {
      return empList;
    }
  };

  html = ({ root, template }) => {
    root.innerHTML = template;
    return root;
  };

  text = ({ root, template }) => {
    root.innerText = template;
    return root;
  };

  // 响应式window
  resize = ({ res = () => {} }) => window.addEventListener("resize", res);
}

export default QueryUtils;
