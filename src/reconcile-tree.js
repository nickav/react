import { renderVNode, renderDOM } from './render';

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

// where each tree is a vnode
const reconcileTree = (nextTree, prevTree = {}) => {
  // break if no children to compare
  if (!prevTree.children && !nextTree.children) {
    return;
  }

  // create lookup object of key -> child
  const prevVNodeMap = computeChildKeyMap(prevTree.children || []);
  const nextVNodeMap = computeChildKeyMap(nextTree.children || []);

  // check removed children
  for (let i = prevTree.children.length - 1; i >= 0; i--) {
    const child = prevTree.children[i];
    const key = computeKey(child, i);

    const wasRemoved = !nextVNodeMap[key];
    if (wasRemoved) {
      child && child._inst && child._inst.componentWillUnmount();
      const parent = prevTree._root;
      parent.removeChild(parent.childNodes[i]);
    }
  }

  //console.log({ nextVNodeMap, prevVNodeMap, nextTree });

  /*
  if (nextTree.children.length === 3) {
    debugger;
  }
  */

  // handle new children
  for (let i = 0; i < nextTree.children.length; i++) {
    const child = nextTree.children[i];
    const key = computeKey(child, i);

    const wasAdded =
      nextVNodeMap.hasOwnProperty(key) && !prevVNodeMap.hasOwnProperty(key);

    if (wasAdded) {
      const html = renderVNode(child, renderDOM);

      const parent = nextTree._root;
      if (parent.childNodes[i]) {
        parent.childNodes[i].before(html);
      } else {
        parent.appendChild(html);
      }

      continue;
    }

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
          : true;

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
        // TODO: maybe reconcile things here too?
        const html = renderVNode(child, renderDOM);

        console.log({ prevChild, key, prevTree });
        const domNode = prevTree._root.childNodes[i];
        domNode.replaceWith(html);

        //child._root = html;
      }
    }
  }
};

export default reconcileTree;
