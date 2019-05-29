import { renderVNode, renderDOM } from './render';

const computeKey = (vnode, i) =>
  (vnode && vnode.props && vnode.props.key) ||
  `${((vnode || {}).type || {}).name ||
    (vnode || {}).type ||
    typeof vnode}.${i}`;

const computeChildKeyMap = (arr) =>
  arr.reduce(
    (memo, child, i) => ((memo[child && computeKey(child, i)] = child), memo),
    {}
  );

const diffTree = (nextVNode, prevVNode = {}) => {
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

    if (child && child._root && wasRemoved) {
      child._inst && child._inst.componentWillUnmount();
      child._root.parentElement.removeChild(child._root);
    }
  }

  let prevSibbling = prevVNode._root.firstChild;

  // handle new children
  for (let i = 0; i < nextVNode.children.length; i++) {
    const child = nextVNode.children[i];
    const key = computeKey(child, i);

    const wasAdded = nextVNodeMap[key] && !prevVNodeMap[key];
    const wasChanged = nextVNodeMap[key] && prevVNodeMap[key];

    if (wasAdded) {
      const nextSibbling = renderVNode(child, renderDOM);
      prevSibbling.insertAdjacentElement('afterend', nextSibbling);
      prevSibbling = nextSibbling;
    } else if (wasChanged) {
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
      }

      prevSibbling = child._root;
    }
  }
};

export default diffTree;
