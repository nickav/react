export { default as Component } from './Component';
export { default as render } from './render';

export const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});

export const h = createElement;
