import { renderVNode, renderDOM } from './render';

const computeKey = (vnode, i) => {
  if (vnode && vnode.props && vnode.props.key) {
    return vnode.props.key;
  }

  return `${
    vnode && vnode.type ? vnode.type.name || vnode.type : typeof vnode
  }.${i}`;
};

const computeChildKeyMap = (arr) =>
  arr.reduce(
    (memo, child, i) => ((memo[computeKey(child, i)] = child), memo),
    {}
  );

const reconcileTree = (nextVNode, prevVNode = {}) => {
  // break if no children to compare
  if (!prevVNode.children && !nextVNode.children) {
    return;
  }

  // create lookup object of key -> child
  const prevVNodeMap = computeChildKeyMap(prevVNode.children || []);
  const nextVNodeMap = computeChildKeyMap(nextVNode.children || []);

  // check removed children
  for (let i = 0; i < prevVNode.children.length; i++) {
    const child = prevVNode.children[i];
    const key = computeKey(child, i);

    const wasRemoved = !nextVNodeMap[key];

    if (wasRemoved) {
      if (child && child._root) {
        // child is a vnode
        child._inst && child._inst.componentWillUnmount();
        child._root.parentElement.removeChild(child._root);
      } else {
        // child is a comment | string | number | null
        const parent = prevVNode._root;
        parent.removeChild(parent.childNodes[i]);
      }
    }
  }

  let prevSibbling = nextVNode._root.firstChild;

  // handle new children
  for (let i = 0; i < nextVNode.children.length; i++) {
    const child = nextVNode.children[i];
    const key = computeKey(child, i);

    const wasAdded = nextVNodeMap[key] && !prevVNodeMap[key];
    const wasUnchanged = nextVNodeMap[key] && prevVNodeMap[key];

    console.log('child', child, { wasAdded, wasUnchanged }, prevSibbling);

    if (wasAdded) {
      const nextSibbling = renderVNode(child, renderDOM);
      console.log('  adding...', prevSibbling, nextSibbling);
      prevSibbling.after(nextSibbling);
      prevSibbling = nextSibbling;
    } else if (wasUnchanged) {
      const shouldUpdate = child._inst
        ? child._inst.shouldComponentUpdate(child.props)
        : true;

      if (shouldUpdate) {
        console.log('changed', child);
        const html = renderVNode(
          child._inst ? child._inst.render() : child,
          renderDOM
        );
        prevVNodeMap[key]._root.replaceWith(html);
        child._root = html;
        prevSibbling = html;
      }
    } else {
      prevSibbling = prevSibbling.nextSibbling || prevSibbling;
    }
  }
};

export default reconcileTree;
