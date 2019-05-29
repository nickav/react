import { render, renderDOM } from './render';

const computeKey = (vnode, i) =>
  (vnode.props && vnode.props.key) || `${(vnode.type || {}).name || vnode.type || typeof vnode}.${i}`;

const computeChildKeyMap = (arr) =>
  arr.reduce(
    (memo, child, i) => ((memo[child && computeKey(child, i)] = child), memo),
    {}
  );

const diffTree = (newVNode, oldVNode = {}) => {
  if (!oldVNode.children && !newVNode.children) {
    return;
  }

  //newVNode._root = oldVNode._root;

  const oldVNodeMap = computeChildKeyMap(oldVNode.children || []);
  const newVNodeMap = computeChildKeyMap(newVNode.children || []);

  const removed = Object.entries(oldVNodeMap)
    .filter(([key]) => !newVNodeMap[key])
    .map((e) => e[1])
    .filter(e => e);
  
  const added = Object.entries(newVNodeMap)
    .filter(([key]) => !oldVNodeMap[key])
    .map((e) => e[1])
    .filter(e => e);
  
  const same = Object.keys(newVNodeMap)
    .filter((key) => oldVNodeMap[key])
    .map((key) => [oldVNodeMap[key], newVNodeMap[key]])
    .filter(e => e);

  const changed = same.filter(([prev, next]) => {
    if (next._inst) {
      return next._inst.shouldComponentUpdate(next.props, {});
    }

    // TODO: maybe diff on props or something?
    return true;
  });

  console.log({ oldVNode, newVNode });
  console.log({ removed, added, changed });

  // call lifecycle methods
  removed.forEach(vnode => vnode._inst && vnode._inst.componentWillUnmount());
  changed.forEach(vnode => vnode._inst && vnode._inst.componentWillReceiveProps(vnode.props));

  // update dom
  removed.forEach(vnode => {
    console.log('removing', vnode._root);
    vnode._root.parentElement.removeChild(vnode._root)
  });
  
  added.forEach(vnode => {
    const html = render(vnode, renderDOM);
    console.log(oldVNode)
    oldVNode._root.appendChild(html);
    vnode._root = html;
  });

  changed.forEach(changes => {
    const vnode = changes[1];
    const html = render(vnode._inst ? vnode._inst.render() : vnode, renderDOM);
    changes[0]._root.replaceWith(html);
    vnode._root = html;
  });

  console.log({oldVNodeMap, newVNodeMap});





  /*
  return newVNode.children.map(child => {
    if (added.includes(child)) {
      return render(child, renderDOM);
    }

    const changedChild = changed.find(e => e[1] === child);
    return diffTree(changedChild[1], changedChild[0]);
  });*/

  
  //added.forEach(el => console.log(render(el, renderDOM)));
  /*same.forEach(([oldNode, newNode]) => {
    diffTree(newNode, oldNode)
  });*/

  //return added.map(el => render(el, renderDOM));
};

export default diffTree;