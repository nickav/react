import { renderVNode, renderDOM, getComponentProps, setRef } from './render';
import { updateElementProps } from './dom';
import { shallowEqual } from './functions';
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

  return (
    nextVNode.type !== prevVNode.type ||
    !shallowEqual(nextVNode.props, prevVNode.props) ||
    !shallowEqual(nextVNode.children, prevVNode.children)
  );
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
    const prevVNode = prevChildren[i];
    const key = computeKey(prevVNode, i);

    const wasRemoved = !nextVNodeMap.hasOwnProperty(key);
    if (wasRemoved) {
      prevVNode && prevVNode._inst && prevVNode._inst.componentWillUnmount();
      const parent = prevTree._root;
      parent.removeChild(parent.childNodes[i]);
    }
  }

  // handle added children
  for (let i = 0; i < nextChildren.length; i++) {
    const nextVNode = nextChildren[i];
    const key = computeKey(nextVNode, i);

    const wasAdded =
      nextVNodeMap.hasOwnProperty(key) && !prevVNodeMap.hasOwnProperty(key);

    if (wasAdded) {
      const html = renderVNode(nextVNode, renderDOM);

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
    const nextVNode = nextChildren[i];
    const key = computeKey(nextVNode, i);

    const wasChanged =
      nextVNodeMap.hasOwnProperty(key) && prevVNodeMap.hasOwnProperty(key);

    if (wasChanged) {
      // prevChild has the previous vnode _inst
      const prevVNode = prevVNodeMap[key];

      const shouldUpdate =
        prevVNode && prevVNode._inst
          ? prevVNode._inst.shouldComponentUpdate(
              nextVNode.props,
              prevVNode._inst.state
            )
          : shouldVNodeUpdate(nextVNode, prevVNode);

      if (!shouldUpdate) {
        continue;
      }

      if (t.isComponentNode(prevVNode)) {
        const _inst = prevVNode._inst;
        const prevProps = getComponentProps(prevVNode);
        const prevState = _inst.state;
        const nextProps = getComponentProps(nextVNode);
        const nextState = prevState;

        // call lifecycle method
        _inst.componentWillReceiveProps(nextProps, nextState);
        // update the props
        _inst.props = nextProps;
        // render
        const tempVNode = _inst.render(nextProps, nextState);
        reconcileTree(tempVNode, prevVNode._prevVNode);
        setRef(tempVNode);

        _inst.componentDidUpdate(prevProps, prevState);
        continue;
      }

      if (t.isLiteralNode(nextVNode)) {
        const html = renderVNode(nextVNode, renderDOM);
        const parent = nextTree._root;
        parent.childNodes[i].replaceWith(html);
        continue;
      }

      if (t.isHTMLNode(nextVNode)) {
        updateElementProps(prevVNode._root, nextVNode.props, prevVNode.props);
        reconcileTree(nextVNode, prevVNode);
        setRef(nextVNode);
        continue;
      }

      if (t.isFunctionalNode(nextVNode)) {
        const tempVNode = nextVNode.type(getComponentProps(nextVNode));
        reconcileTree(tempVNode, prevVNode._prevVNode);
        setRef(tempVNode);
        continue;
      }

      throw `Unknown component: ${vnode}`;
    }
  }
};

export default reconcileTree;
