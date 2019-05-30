import * as t from './types';
import { updateElementProps } from './dom';

export const getComponentProps = (vnode) => ({
  ...vnode.props,
  children: vnode.children || props.children,
});

// vnode -> renderNode
export const renderVNode = (vnode, renderNode) => {
  if (t.isEmptyNode(vnode)) {
    return renderNode(vnode, renderVNode);
  }

  if (t.isTextNode(vnode)) {
    return renderNode(vnode.toString(), renderVNode);
  }

  if (t.isHTMLNode(vnode)) {
    return renderNode(vnode, renderVNode);
  }

  if (t.isComponentNode(vnode)) {
    const props = getComponentProps(vnode);
    const _inst = new vnode.type(props);
    _inst._vnode = vnode;
    vnode._inst = _inst;

    _inst.componentWillMount();
    setTimeout(() => _inst.componentDidMount(), 0);

    const nextVNode = (vnode._prevVNode = _inst.render(props, _inst.state));
    return (vnode._root = renderVNode(nextVNode, renderNode));
  }

  if (t.isFunctionalNode(vnode)) {
    const nextVNode = (vnode._prevVNode = vnode.type(getComponentProps(vnode)));
    return (vnode._root = renderVNode(nextVNode, renderNode));
  }

  throw `Unknown component: ${vnode}`;
};

// vnode -> DOM Element
export const renderDOM = (vnode, render) => {
  // null and boolean are just comments (for debugging)
  if (t.isEmptyNode(vnode)) {
    return document.createComment(`(${vnode})`);
  }

  // strings just convert to #text nodes
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  // create a DOM element with the nodeName of our VDOM element:
  const n = document.createElement(vnode.type);
  vnode._root = n;

  // copy attributes onto the new node:
  updateElementProps(n, vnode.props);

  // render children
  vnode.children.forEach((child) => n.appendChild(render(child, renderDOM)));

  return n;
};

export default (vnode, root) => {
  root.appendChild(renderVNode(vnode, renderDOM));
};
