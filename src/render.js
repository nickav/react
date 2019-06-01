import * as t from './types';
import { updateElementProps } from './dom';

export const setRef = (vnode) => {
  if (vnode.props && vnode.props.ref) {
    vnode.props.ref(vnode._inst || vnode._root);
  }
};

const dirtyRenderVNode = (vnode, nextVNode, renderNode) => {
  vnode._prevVNode = nextVNode;
  vnode._root = renderVNode(vnode._prevVNode, renderNode);
  setRef(vnode);
  return vnode._root;
};

export const getComponentProps = (vnode) => ({
  ...(vnode.type.defaultProps || {}),
  ...vnode.props,
  children: vnode.children || props.children,
});

// vnode -> renderNode
export const renderVNode = (vnode, renderNode) => {
  if (typeof vnode === 'function') {
    vnode = vnode();
  }

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

    return dirtyRenderVNode(
      vnode,
      _inst.render(props, _inst.state),
      renderNode
    );
  }

  if (t.isFunctionalNode(vnode)) {
    return dirtyRenderVNode(
      vnode,
      vnode.type(getComponentProps(vnode)),
      renderNode
    );
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
  if (t.isTextNode(vnode)) {
    return document.createTextNode(vnode);
  }

  // create a DOM element with the nodeName of our VDOM element:
  const n = document.createElement(vnode.type);
  vnode._root = n;
  setRef(vnode);

  // copy attributes onto the new node:
  updateElementProps(n, vnode.props);

  // render children
  vnode.children.forEach((child) => n.appendChild(render(child, renderDOM)));

  return n;
};

export default (vnode, root) => {
  root.appendChild(renderVNode(vnode, renderDOM));
};
