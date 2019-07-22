// 阉割版的JQuery
class QueryUtils {
  state = {};
  constructor() {}

  // 绑定dom
  $ = (target = null) => {
    if (target == null) return;
    let {
      getAttr,
      getStyle,
      bind,
      css,
      addClass,
      html,
      text,
      removeAll,
      append,
      keyframes,
      frameAnimation
    } = this;

    let root = document.querySelector(target);
    let style = getStyle({ root });
    root.show = (time = 0) => {
      let styles = { opacity: "1", time, wait: 0 };
      css({
        root,
        styles,
        style
      });
    };
    root.hide = (time = 0) => {
      let styles = { opacity: "0", time, wait: 0 };
      css({
        root,
        styles,
        style
      });
    };
    root.width = getAttr({ attr: "width", root });
    root.height = getAttr({ attr: "height", root });
    root.top = getAttr({ attr: "top", root });
    root.right = getAttr({ attr: "right", root });
    root.down = getAttr({ attr: "down", root });
    root.left = getAttr({ attr: "left", root });
    root.bind = (event, res) => bind({ root, eType: event, res });
    root.removeBind = (event, res) =>
      bind({ remove: true, root, eType: event, res });
    root.addClass = className => addClass({ root, className });
    root.removeClass = className => addClass({ root, className, add: false });
    root.removeChild = targets => removeAll(targets);
    root.append = ({ type = "div", attr = {} }) => append({ root, attr, type });
    root.keyframes = args => {
      if (args instanceof Object) {
        let getList = [];
        if (args instanceof Array) {
          getList = [];
          getList = args;
        } else {
          let formatData = Object.assign({ animation: {}, keyframe: {} }, args);
          getList = [formatData];
        }
        keyframes({ root, list: getList, target });
      }
    };

    root.html = template =>
      html({
        root,
        template
      });
    root.text = template =>
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

    root.animate = (styles = { time: 0, wait: 0, ease: "linear" }) =>
      css({
        root,
        styles,
        style
      });
    return root;
  };

  // 帧动画
  keyframes = ({ root = null, list = [], target }) => {
    console.log(list);
    let token_ = new Date().getTime();
    let parseAnimation = ``;
    let parseKeyframe = ``;
    let formatKeyframes = ``;

    for (let i = 0; i < list.length; i++) {
      let tokenName = "ani" + token_++;
      let { animation, keyframe } = list[i];
      let getAnimation = animation;
      getAnimation.name = tokenName;
      let animationData = Object.assign(
        {
          name: "ani",
          duration: 0,
          timingFun: "linear",
          delay: 0,
          count: 1,
          direction: "normal",
          mode: "forwards"
        },
        getAnimation
      );
      let rootLazyTime = animationData.duration - 0 + animationData.delay - 0;
      if (root.getAttribute("data-anilazytime")) {
        let getAnilazytime = root.getAttribute("data-anilazytime");
        root.setAttribute(
          "data-anilazytime",
          rootLazyTime + (getAnilazytime - 0)
        );
      } else {
        root.setAttribute("data-anilazytime", 0);
      }

      Object.keys(animationData).map(v => {
        if (animationData[v] !== "")
          switch (v) {
            case "name":
              parseAnimation += `${animationData[v]} `;
              break;
            case "duration":
              parseAnimation += `${animationData[v]}s `;
              break;
            case "timingFun":
              parseAnimation += `${animationData[v]} `;
              break;
            case "delay":
              parseAnimation += `${animationData[v] -
                0 +
                parseInt(root.getAttribute("data-anilazytime"))}s `;
              break;
            case "count":
              parseAnimation += `${animationData[v]} `;
              break;
            case "direction":
              parseAnimation += `${animationData[v]} `;
              break;
            case "mode":
              parseAnimation += `${animationData[v]} `;
              break;
          }
      });

      if (list[i + 1] !== undefined) {
        parseAnimation += ", ";
      } else {
        parseAnimation += ";";
      }

      let initV = "";

      if (list[i - 1]) {
        Object.keys(list[i - 1].keyframe).map(v => {
          if (v == "100%" || v == "to") {
            Object.keys(list[i - 1].keyframe[v]).map(vv => {
              initV += `${vv}: ${list[i - 1].keyframe[v][vv]};`;
            });
          }
        });
      }

      parseKeyframe = "";
      let test0 = false;
      Object.keys(keyframe).map(v => {
        parseKeyframe += `${v}{ `;

        if (v == "0%" || v == "from") {
          parseKeyframe += initV;
          console.log("parseKeyframe ", parseKeyframe);
          test0 = true;
        }

        Object.keys(keyframe[v]).map(vv => {
          parseKeyframe += `${vv}: ${keyframe[v][vv]};`;
        });

        parseKeyframe += `}`;
      });

      if (!test0 && initV !== "") {
        parseKeyframe += `0% {${initV}}`;
      }

      formatKeyframes += `
        @keyframes ${tokenName} {
          ${parseKeyframe}
        }

        @-webkit-keyframes ${tokenName} {
          ${parseKeyframe}
        }
    `;
    }

    let { createEl } = this;
    createEl({
      type: "style",
      attr: {
        html: `${target}{animation: ${parseAnimation}} ${formatKeyframes}`
      },
      root: target
    });

    // return root;
  };

  // 插入子元素
  append = ({ root, attr, type }) => {
    if (root == null) return;
    let createDom = document.createElement(type);
    Object.keys(attr).map(v => {
      if (v == "html") {
        createDom.innerHTML = attr[v];
      } else {
        createDom.setAttribute(v, attr[v]);
      }
    });
    root.appendChild(createDom);
    return root;
  };

  // 获取当前的样式
  getStyle = ({ root }) => {
    let style = null;
    (style = root.getAttribute("style")) == null ? "" : style;
    return style == null ? "" : style;
  };

  // 添加class
  addClass = ({ root, className, add = true }) => {
    let oldClassName = root.getAttribute("class");
    if (add) {
      root.setAttribute(
        "class",
        (oldClassName ? oldClassName + " " : "") + className
      );
    } else {
      root.setAttribute(
        "class",
        oldClassName
          .split(" ")
          .filter(v => v !== className)
          .join(" ")
      );
    }

    return root;
  };

  // 移除
  removeAll = target => {
    let getTargets = document.querySelectorAll(target);
    for (let i = 0; i < getTargets.length; i++) {
      getTargets[i].remove();
    }
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
        return window.innerWidth - root.offsetLeft - root.width;
      case "down":
        return window.innerHeight - root.offsetTop - root.height;
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
    if (styles.time > 0) {
      const { ease = "linear", time = 0, wait = 0 } = styles;
      root.style =
        styleSnippets +
        `transition: all ${time / 1000}s ${ease} ${wait / 1000}s;`;
      setTimeout(() => {
        Object.keys(styles).map(v => {
          if (
            v !== "ease" &&
            v !== "time" &&
            v !== "wait" &&
            !(v == "display" && (styles[v] == "block" || styles[v] == "none"))
          ) {
            styleSnippets += `${v}: ${styles[v]};`;
          }
        });
        root.style =
          styleSnippets +
          `transition: all ${time / 1000}s ${ease} ${wait / 1000}s;` +
          styleSnippets;
        setTimeout(() => {
          root.style =
            styleSnippets +
            `transition: all ${time / 1000}s ${ease} ${wait / 1000}s;` +
            styleSnippets +
            `display: ${styles["display"]};`;
        }, time - 1);
      }, 0);
    } else {
      Object.keys(styles).map(v => {
        styleSnippets += `${v}: ${styles[v]};`;
      });
      root.style = styleSnippets;
    }
    return root;
  };

  // 事件绑定
  bind = ({ remove = false, root = window, eType = "click", res }) => {
    if (remove) {
      root.removeEventListener(eType, res, false);
    } else {
      root.addEventListener(eType, res, false);
    }

    return root;
  };

  // 获取最新的window参数
  getWindowState = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scrollTop:
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop,
    scrollLeft:
      document.documentElement.scrollLeft ||
      window.pageXOffset ||
      document.body.scrollLeft
  });

  // 创建DOM
  createEl = ({ attr = {}, root = null, length = 1, type = "div" }) => {
    let rootDom = document.querySelector(root == null ? "body" : root);
    let empList = [];
    for (let i = 0; i < length; i++) {
      const createDom = document.createElement(type);
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
