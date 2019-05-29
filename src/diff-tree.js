import { renderVNode, renderDOM } from './render';

const computeKey = (vnode, i) =>
  (vnode.props && vnode.props.key) ||
  `${(vnode.type || {}).name || vnode.type || typeof vnode}.${i}`;

const computeChildKeyMap = (arr) =>
  arr.reduce(
    (memo, child, i) => ((memo[child && computeKey(child, i)] = child), memo),
    {}
  );

// a - b
const diffChildrenMaps = (a, b) =>
  Object.entries(b)
    .filter(([key]) => !a[key])
    .map((e) => e[1])
    .filter((e) => e);

const findChangedChildren = (nextMap, prevMap) =>
  Object.keys(nextMap)
    .filter((key) => prevMap[key])
    .map((key) => [prevMap[key], nextMap[key]])
    .filter(([prev, next]) => {
      if (next._inst) {
        return next._inst.shouldComponentUpdate(next.props, {});
      }

      // TODO: maybe diff on props or something?
      return true;
    });

const diffTree = (nextVNode, prevVNode = {}) => {
  // break if no children to compare
  if (!prevVNode.children && !nextVNode.children) {
    return;
  }

  // create lookup object of key -> child
  const prevVNodeMap = computeChildKeyMap(prevVNode.children || []);
  const nextVNodeMap = computeChildKeyMap(nextVNode.children || []);

  // compare vnodes
  const removed = diffChildrenMaps(nextVNodeMap, prevVNodeMap);
  const added = diffChildrenMaps(prevVNodeMap, nextVNodeMap);
  const changed = findChangedChildren(nextVNodeMap, prevVNodeMap);

  // call lifecycle methods
  removed.forEach((vnode) => vnode._inst && vnode._inst.componentWillUnmount());
  changed.forEach(
    (vnode) => vnode._inst && vnode._inst.componentWillReceiveProps(vnode.props)
  );

  // update dom
  removed.forEach((vnode) => {
    vnode._root.parentElement.removeChild(vnode._root);
  });

  // TODO: fix ordering of added elements!
  added.forEach((vnode) => {
    prevVNode._root.appendChild(renderVNode(vnode, renderDOM));
  });

  changed.forEach((changes) => {
    const vnode = changes[1];
    const html = renderVNode(
      vnode._inst ? vnode._inst.render() : vnode,
      renderDOM
    );
    changes[0]._root.replaceWith(html);
    vnode._root = html;
  });
};

export default diffTree;
