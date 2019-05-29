import diffTree from './diff-tree';
import { render, renderDOM } from './render';

export { default as Component } from './Component';
export { render } from './render';

// returns a vnode
export const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});


export const mount = (root, vnode) => {
  root.appendChild(render(vnode, renderDOM));
  //root.appendChild(diffTree({ children: [vnode] }, {})[0]);
};
