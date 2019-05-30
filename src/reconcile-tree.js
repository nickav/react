import { renderVNode, renderDOM, getComponentProps, setRef } from './render';
import { updateElementProps } from './dom';
import * as t from './types';

const computeKey = (vnode, i) => {
  if (vnode && vnode.props && vnode.props.key) {
    return vnode.props.key;
  }

  const key =
    vnode && vnode.type ? vnode.type.name || vnode.type : typeof vnode;

  return `__react__.${key}-${i}`;
};

const computeChildKeyMap = (arr) =>
  arr.reduce(
    (memo, child, i) => ((memo[computeKey(child, i)] = child), memo),
    {}
  );

const shouldVNodeUpdate = (nextVNode, prevVNode) => {
  if (t.isLiteralNode(prevVNode)) {
    return prevVNode !== nextVNode;
  }

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

      const parent = nextTree._root;
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

      if (t.isComponentNode(prevChild)) {
        const prevProps = getComponentProps(prevChild);
        const prevState = prevChild._inst.state;
        const nextProps = getComponentProps(child);
        const nextState = prevState;

        // call lifecycle method
        prevChild._inst.componentWillReceiveProps(nextProps, nextState);
        // update the props
        prevChild._inst.props = nextProps;
        // render
        const nextVNode = prevChild._inst.render(nextProps, nextState);
        reconcileTree(nextVNode, prevChild._prevVNode);
        setRef(nextVNode);

        prevChild._inst.componentDidUpdate(prevProps, prevState);
        continue;
      }

      if (t.isLiteralNode(child)) {
        const html = renderVNode(child, renderDOM);
        const parent = nextTree._root;
        parent.childNodes[i].replaceWith(html);
        continue;
      }

      if (t.isHTMLNode(child)) {
        const nextVNode = child;
        updateElementProps(prevChild._root, nextVNode.props, prevChild.props);
        reconcileTree(nextVNode, prevChild);
        setRef(nextVNode);
        continue;
      }

      if (t.isFunctionalNode(child)) {
        const nextVNode = child.type(getComponentProps(child));
        reconcileTree(nextVNode, prevChild._prevVNode);
        setRef(nextVNode);
        continue;
      }

      throw `Unknown component: ${vnode}`;
    }
  }
};

export default reconcileTree;
