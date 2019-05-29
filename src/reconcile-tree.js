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

const reconcileTree = (nextVNode, prevVNode = {}) => {
  // break if no children to compare
  if (!prevVNode.children && !nextVNode.children) {
    return;
  }

  // create lookup object of key -> child
  const prevVNodeMap = computeChildKeyMap(prevVNode.children || []);
  const nextVNodeMap = computeChildKeyMap(nextVNode.children || []);

  // check removed children
  for (let i = prevVNode.children.length - 1; i >= 0; i--) {
    const child = prevVNode.children[i];
    const key = computeKey(child, i);

    const wasRemoved = !nextVNodeMap[key];
    if (wasRemoved) {
      child && child._inst && child._inst.componentWillUnmount();
      const parent = prevVNode._root;
      parent.removeChild(parent.childNodes[i]);
    }
  }

  let prevSibling = nextVNode._root.firstChild;
  console.log({ prevSibling });
  // debugger;

  // handle new children
  for (let i = 0; i < nextVNode.children.length; i++) {
    const child = nextVNode.children[i];
    const key = computeKey(child, i);

    const wasAdded =
      nextVNodeMap.hasOwnProperty(key) && !prevVNodeMap.hasOwnProperty(key);
    const wasChanged =
      nextVNodeMap.hasOwnProperty(key) && prevVNodeMap.hasOwnProperty(key);

    if (wasAdded) {
      const nextSibling = renderVNode(child, renderDOM);
      if (!prevSibling) {
        nextVNode._root.appendChild(nextSibling);
      } else if (i === 0) {
        prevSibling.before(nextSibling);
      } else {
        prevSibling.after(nextSibling);
      }
      prevSibling = nextSibling;
    } else if (wasChanged) {
      // prevChild has the previous vnode _inst
      const prevChild = prevVNodeMap[key];

      const shouldUpdate =
        prevChild && prevChild._inst
          ? prevChild._inst.shouldComponentUpdate(
              child.props,
              prevChild._inst.state
            )
          : true;

      if (shouldUpdate) {
        console.log('shouldUpdate', prevChild);

        if (prevChild && prevChild._inst) {
          const nextProps = child.props;
          const nextState = prevChild._inst.state;
          // call lifecycle method
          prevChild._inst.componentWillReceiveProps(nextProps, nextState);
          // update the props
          prevChild._inst.props = nextProps;
          // render
          const nextVNode = prevChild._inst.render(nextProps, nextState);
          nextVNode._root = prevChild._root;
          reconcileTree(nextVNode, prevChild._prevVNode);
        } else {
          const html = renderVNode(child, renderDOM);

          console.log({ prevChild, key, prevVNode });
          const domNode = prevVNode._root.childNodes[i];
          domNode.replaceWith(html);

          //child._root = html;
          prevSibling = html;
        }

        //child._inst && child._inst.componentDidUpdate(child.props, child._inst.state);
      }
    } else {
      prevSibling = prevSibling.nextSibling || prevSibling;
    }
  }
};

export default reconcileTree;
