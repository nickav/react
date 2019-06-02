import Component from './Component';

export const isEmptyNode = (vnode) =>
  vnode == null || typeof vnode === 'boolean';

export const isTextNode = (vnode) =>
  typeof vnode === 'string' || typeof vnode === 'number';

export const isLiteralNode = (vnode) => isTextNode(vnode) || isEmptyNode(vnode);

export const isHTMLNode = (vnode) => vnode && typeof vnode.type === 'string';

export const isFragmentNode = (vnode) => Array.isArray(vnode);

export const isComponent = (vnode) =>
  vnode && Component.isPrototypeOf(vnode.type);

export const isFunctionalComponent = (vnode) =>
  vnode && typeof vnode.type === 'function';

export const isValidElement = (vnode) =>
  isEmptyNode(vnode) ||
  isTextNode(vnode) ||
  isHTMLNode(vnode) ||
  isFragmentNode(vnode) ||
  isComponent(vnode) ||
  isFunctionalComponent(vnode);
