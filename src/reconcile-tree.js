import { renderVNode, renderDOM, isLiteralNode } from './render';

const objDiff = (o1, o2) =>
  Object.keys(o2).reduce((diff, key) => {
    if (!key in o2) diff[key] = o2[key];
    if (o1[key] !== o2[key]) diff[key] = o2[key];
    return diff;
  }, {});

const computeKey = (vnode, i) => {
  if (vnode && vnode.props && vnode.props.key) {
    return vnode.props.key;
  }

  return `${
    vnode && vnode.type ? vnode.type.name || vnode.type : typeof vnode
  }.${i}`;
};

const computeChildKeyMap = arr =>
  arr.reduce(
    (memo, child, i) => ((memo[computeKey(child, i)] = child), memo),
    {}
  );

const shouldVNodeUpdate = (nextVNode, prevVNode) => {
  if (isLiteralNode(prevVNode)) {
    return prevVNode !== nextVNode;
  }

  // TODO:
  console.log({ nextVNode, prevVNode });
  return true;
};

// where each tree is a vnode
const reconcileTree = (nextTree, prevTree) => {
  nextTree._root = prevTree._root;

  // break if no children to compare
  if (!prevTree.children && !nextTree.children) {
    return;
  }

  // create lookup object of key -> child
  const prevChildren = prevTree.children || [];
  const nextChildren = nextTree.children || [];
  const prevVNodeMap = computeChildKeyMap(prevChildren);
  const nextVNodeMap = computeChildKeyMap(nextChildren);

  // check removed children
  for (let i = prevChildren.length - 1; i >= 0; i--) {
    const child = prevChildren[i];
    const key = computeKey(child, i);

    const wasRemoved = !nextVNodeMap.hasOwnProperty(key);
    if (wasRemoved) {
      child && child._inst && child._inst.componentWillUnmount();
      const parent = prevTree._root;
      parent.removeChild(parent.childNodes[i]);
    }
  }

  // handle added children
  for (let i = 0; i < nextChildren.length; i++) {
    const child = nextChildren[i];
    const key = computeKey(child, i);

    const wasAdded =
      nextVNodeMap.hasOwnProperty(key) && !prevVNodeMap.hasOwnProperty(key);

    if (wasAdded) {
      const html = renderVNode(child, renderDOM);

      const parent = prevTree._root;
      if (parent.childNodes[i]) {
        parent.childNodes[i].before(html);
      } else {
        parent.appendChild(html);
      }
    }
  }

  // handle changed children
  for (let i = 0; i < nextChildren.length; i++) {
    const child = nextChildren[i];
    const key = computeKey(child, i);

    const wasChanged =
      nextVNodeMap.hasOwnProperty(key) && prevVNodeMap.hasOwnProperty(key);

    if (wasChanged) {
      // prevChild has the previous vnode _inst
      const prevChild = prevVNodeMap[key];

      const shouldUpdate =
        prevChild && prevChild._inst
          ? prevChild._inst.shouldComponentUpdate(
              child.props,
              prevChild._inst.state
            )
          : shouldVNodeUpdate(child, prevChild);

      if (!shouldUpdate) {
        continue;
      }

      if (prevChild && prevChild._inst) {
        const prevProps = prevChild._inst.props;
        const prevState = prevChild._inst.state;
        const nextProps = child.props;
        const nextState = prevState;

        // call lifecycle method
        prevChild._inst.componentWillReceiveProps(nextProps, nextState);
        // update the props
        prevChild._inst.props = nextProps;
        // render
        const nextVNode = prevChild._inst.render(nextProps, nextState);
        nextVNode._root = prevChild._root;
        reconcileTree(nextVNode, prevChild._prevVNode);

        prevChild._inst.componentDidUpdate(prevProps, prevState);
      } else {
        // Literals
        const nextVNode = child;
        if (isLiteralNode(nextVNode)) {
          const html = renderVNode(nextVNode, renderDOM);
          const parent = prevTree._root;
          parent.childNodes[i].replaceWith(html);
        } else {
          // update html attributes
          const nextProps = nextVNode.props || {};
          const prevProps = prevChild.props || {};

          Object.keys(prevProps).forEach(oldProp => {
            prevChild._root.removeAttribute(oldProp);
          });

          Object.keys(nextProps).forEach(prop => {
            prevChild._root.setAttribute(prop, nextProps[prop]);
          });

          // Object.keys(props).forEach(k => {
          //   if (nextProps.entries.map)
          //     prevChild._root.setAttribute(k, props[k]);
          // });

          reconcileTree(nextVNode, prevChild);
        }
      }
    }
  }
};

export default reconcileTree;
