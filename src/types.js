import Component from './Component';

export const isEmptyNode = (vnode) =>
  vnode === null || typeof vnode === 'boolean';

export const isTextNode = (vnode) =>
  typeof vnode === 'string' || typeof vnode === 'number';

export const isLiteralNode = (vnode) => isTextNode(vnode) || isEmptyNode(vnode);

export const isHTMLNode = (vnode) => typeof vnode.type === 'string';

export const isComponentNode = (vnode) => Component.isPrototypeOf(vnode.type);

export const isFunctionalNode = (vnode) => typeof vnode.type === 'function';
