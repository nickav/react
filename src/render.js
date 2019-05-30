import Component from './Component';

export const getComponentProps = (vnode) => ({
  ...vnode.props,
  children: vnode.children || props.children,
});

export const isEmptyNode = (vnode) =>
  vnode === null || typeof vnode === 'boolean';

export const isTextNode = (vnode) =>
  typeof vnode === 'string' || typeof vnode === 'number';

export const isLiteralNode = (vnode) => isTextNode(vnode) || isEmptyNode(vnode);

export const isHTMLNode = (vnode) => typeof vnode.type === 'string';

export const isComponentNode = (vnode) => Component.isPrototypeOf(vnode.type);

export const isFunctionalNode = (vnode) => typeof vnode.type === 'function';

// vnode -> renderNode
export const renderVNode = (vnode, renderNode) => {
  if (isEmptyNode(vnode)) {
    return renderNode(vnode, renderVNode);
  }

  if (isTextNode(vnode)) {
    return renderNode(vnode.toString(), renderVNode);
  }

  if (isHTMLNode(vnode)) {
    return renderNode(vnode, renderVNode);
  }

  if (isComponentNode(vnode)) {
    vnode._inst = new vnode.type(getComponentProps(vnode));
    vnode._inst._vnode = vnode;

    vnode._inst.componentWillMount();
    setTimeout(() => vnode._inst.componentDidMount(), 0);

    const { _inst, props } = vnode;
    const nextVNode = _inst.render(props, _inst.state);
    const html = renderVNode(nextVNode, renderNode);
    vnode._prevVNode = nextVNode;
    vnode._root = html;
    return html;
  }

  if (isFunctionalNode(vnode)) {
    return renderVNode(vnode.type(getComponentProps(vnode)), renderNode);
  }

  throw `Unknown component: ${vnode}`;
};

export const updateElementProps = (el, nextProps, prevProps) => {
  prevProps = prevProps || {};
  Object.keys(prevProps).forEach((key) => el.removeAttribute(key));

  nextProps = nextProps || {};
  Object.keys(nextProps).forEach((key) => el.setAttribute(key, nextProps[key]));
};

// vnode -> DOM Element
export const renderDOM = (vnode, render) => {
  // null and boolean are just comments (for debugging)
  if (vnode === null || typeof vnode === 'boolean') {
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
