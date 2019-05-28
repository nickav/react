
const computeKey = (vnode, i) =>
  (vnode.props && vnode.props.key) || `${vnode.type || typeof vnode}.${i}`;

const computeChildKeyMap = (arr) =>
  arr.filter(e => e).reduce(
    (memo, child, i) => ((memo[computeKey(child, i)] = child), memo),
    {}
  );

const diffTree = (oldVNode, newVNode) => {
  if (!oldVNode.children && !newVNode.children) return;

  const oldVNodeMap = computeChildKeyMap(oldVNode.children || []);
  const newVNodeMap = computeChildKeyMap(newVNode.children || []);

  const removed = Object.entries(oldVNodeMap)
    .filter(([key]) => !newVNodeMap[key])
    .map((e) => e[1]);
  
  const added = Object.entries(newVNodeMap)
    .filter(([key]) => !oldVNodeMap[key])
    .map((e) => e[1]);
  
  const changed = Object.keys(newVNodeMap)
    .filter((key) => oldVNodeMap[key])
    .map((key) => [oldVNodeMap[key], newVNodeMap[key]]);

  // do things with changes...

  removed.forEach(vnode => vnode._inst && vnode._inst.componentWillUnmount());
  //added.forEach(el => el.componentWillMount && el.componentWillMount());
  changed.forEach(([oldNode, newNode]) => diffTree(oldNode, newNode));

  console.log({ removed, added, changed });
};

export default diffTree;