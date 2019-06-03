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
  nextTree._dom = prevTree._dom;

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
      const parent = prevTree._dom;
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

      const parent = nextTree._dom;
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

    if (!wasChanged) {
      continue;
    }

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

    if (t.isLiteralNode(nextVNode)) {
      const html = renderVNode(nextVNode, renderDOM);
      const parent = nextTree._dom;
      parent.childNodes[i].replaceWith(html);
      continue;
    }

    if (t.isHTMLNode(nextVNode)) {
      updateElementProps(prevVNode._dom, nextVNode.props, prevVNode.props);
      nextVNode._dom = prevVNode._dom;

      reconcileTree(nextVNode, prevVNode);
      setRef(nextVNode);
      continue;
    }

    if (t.isComponent(nextVNode)) {
      const inst = prevVNode._inst;
      const prevProps = getComponentProps(prevVNode);
      const prevState = inst.state;
      const nextProps = getComponentProps(nextVNode);
      const nextState = prevState;

      // call lifecycle method
      inst.componentWillReceiveProps(nextProps, nextState);
      // update props and internals
      inst.props = nextProps;
      nextVNode._inst = prevVNode._inst;
      nextVNode._prevVNode = prevVNode;
      // render
      const tempVNode = inst.render(nextProps, nextState);
      reconcileTree(tempVNode, prevVNode._prevVNode);
      setRef(tempVNode);

      inst.componentDidUpdate(prevProps, prevState);
      continue;
    }

    if (t.isFunctionalComponent(nextVNode)) {
      const tempVNode = nextVNode.type(getComponentProps(nextVNode));
      nextVNode._prevVNode = prevVNode;
      reconcileTree(tempVNode, prevVNode._prevVNode);
      setRef(tempVNode);
      continue;
    }

    console.error('reconcileTree', nextVNode);
    throw `Unknown component: ${vnode.type}`;
  }
};

export default reconcileTree;
