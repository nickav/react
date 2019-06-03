import * as t from './types';
import { updateElementProps } from './dom';

export const getComponentProps = (vnode) => ({
  ...(vnode.type.defaultProps || {}),
  ...vnode.props,
  children: vnode.children || props.children,
});

export const setRef = (vnode) => {
  if (vnode.props && vnode.props.ref) {
    vnode.props.ref(vnode._inst || vnode._dom);
  }
};

export const dirtyRenderVNode = (vnode, nextVNode, ...rest) => {
  vnode._prevVNode = nextVNode;
  vnode._dom = renderVNode(nextVNode, ...rest);
  setRef(vnode);
  return vnode._dom;
};

// vnode -> renderNode
export const renderVNode = (vnode, renderNode, mounts = []) => {
  if (typeof vnode === 'function') {
    vnode = vnode();
  }

  if (t.isEmptyNode(vnode) || t.isHTMLNode(vnode) || t.isFragmentNode(vnode)) {
    return renderNode(vnode, renderVNode, mounts);
  }

  if (t.isTextNode(vnode)) {
    return renderNode(vnode.toString(), renderVNode, mounts);
  }

  if (t.isComponent(vnode)) {
    const props = getComponentProps(vnode);
    const inst = new vnode.type(props);
    inst._vnode = vnode;
    vnode._inst = inst;
    mounts.push(inst);

    return dirtyRenderVNode(
      vnode,
      inst.render(props, inst.state),
      renderNode,
      mounts
    );
  }

  if (t.isFunctionalComponent(vnode)) {
    return dirtyRenderVNode(
      vnode,
      vnode.type(getComponentProps(vnode)),
      renderNode,
      mounts
    );
  }

  console.error('renderVNode', vnode);
  throw `Unknown component: ${vnode.type}`;
};

// vnode -> DOM Element
export const renderDOM = (vnode, render, ...rest) => {
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
    vnode.forEach((e) => fragment.appendChild(render(e, renderDOM, ...rest)));
    return fragment;
  }

  // create a DOM element with the nodeName of our VDOM element:
  const n = document.createElement(vnode.type);
  vnode._dom = n;
  setRef(vnode);

  // copy attributes onto the new node:
  updateElementProps(n, vnode.props);

  // render children
  vnode.children.forEach((child) =>
    n.appendChild(render(child, renderDOM, ...rest))
  );

  return n;
};

const renderString = (vnode, render) => {
  if (t.isEmptyNode(vnode)) {
    return '';
  }

  if (t.isTextNode(vnode)) {
    return vnode;
  }

  if (t.isFragmentNode(vnode)) {
    return vnode.map((e) => render(e, renderString)).join('\n');
  }

  const props = Object.keys(vnode.props)
    .map((key) => `${key}="${vnode.props[key]}"`)
    .join(' ');

  const children = vnode.children
    .map((child) => render(child, renderString))
    .join('\n');

  return `<${vnode.type} ${props}>${children}</${vnode.type}>`;
};

export const renderToString = (vnode) => renderVNode(vnode, renderString);

const render = (vnode, root) => {
  const mounts = [];
  const html = renderVNode(vnode, renderDOM, mounts);

  mounts.forEach((inst) => inst.componentWillMount());
  root.appendChild(html);
  mounts.forEach((inst) => inst.componentDidMount());
};

export default render;
