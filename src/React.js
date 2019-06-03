export { default as Component } from './Component';
export { default as render, renderToString } from './render';
export { default as PureComponent } from './PureComponent';
export { bindListeners } from './dom';
export { isValidElement } from './types';

export const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});

export const h = createElement;
