// 阉割版的JQuery
class QueryUtils {
  state = {};
  constructor() {}

  // 绑定dom
  $ = (target = null) => {
    if (target == null) return;
    let { fade, getAttr, getStyle, bind, css } = this;

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

  // 响应式window
  resize = ({ res = () => {} }) => window.addEventListener("resize", res);
}
