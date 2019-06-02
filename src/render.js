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

  if (t.isEmptyNode(vnode) || t.isHTMLNode(vnode) || t.isFragmentNode(vnode)) {
    return renderNode(vnode, renderVNode);
  }

  if (t.isTextNode(vnode)) {
    return renderNode(vnode.toString(), renderVNode);
  }

  if (t.isComponent(vnode)) {
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

  if (t.isFunctionalComponent(vnode)) {
    return dirtyRenderVNode(
      vnode,
      vnode.type(getComponentProps(vnode)),
      renderNode
    );
  }

  console.error('renderVNode', vnode);
  throw `Unknown component: ${vnode.type}`;
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

  // fragments are not real elements in the dom
  if (t.isFragmentNode(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach((e) => fragment.appendChild(render(e, renderDOM)));
    return fragment;
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
