import React from 'react';

import Link from './Link';
import Thanks from './Thanks';
import Slideshow, { Slide } from './Slideshow';
import Code from './Code';
import { getFunction, getBlockAfter } from '../helpers/functions';

export default class App extends React.Component {
  render() {
    const slides = [
      {
        title: '⚛ react from scratch',
        children: [<p>by anushri, alan and nick</p>],
      },
      {
        title: 'What is React?',
        children: [
          <p>An abstraction around DOM manipulations</p>,
          <p>
            Makes reasoning about state changes easier than manually{' '}
            <span style="color: green;">adding</span> and{' '}
            <span style="color: red;">removing</span> things to the page
          </p>,
        ],
      },
      {
        title: 'WTF is JSX?',
        children: [
          <div>
            <h1 style="color: red">Hello, world!</h1>
          </div>,
          <Code language="html">{`<div><h1 style="color: red">Hello, world!</h1></div>`}</Code>,
          <p>
            <Link to="https://babeljs.io/">Babel</Link> transforms html tags in
            JSX files into (with preset-react):
          </p>,
          <Code language="javascript">{`createElement('div', null, createElement('h1', { style: 'color: red' }, 'Hello, world!'));`}</Code>,
          <p>When createElement is defined, can result in:</p>,
          <Code language="javascript">{`{
  "type": "div",
  "props": null,
  "children": [
    {
      "type": "h1",
      "props": {
        "style": "color: red"
      },
      "children": [
        "Hello, world!"
      ]
    }
  ]
}`}</Code>,
          <p>This is what a Virtual DOM is.</p>,
          <Link to="https://jasonformat.com/wtf-is-jsx/">
            https://jasonformat.com/wtf-is-jsx/
          </Link>,
        ],
      },
      {
        title: '🖼 rendering',
        children: [
          <p>
            We can use the following functions to convert the Virtual DOM into
            real DOM Elements:
          </p>,
          <Code language="javascript">
            {[
              `document.createElement('div');`,
              `document.createComment('(null)');`,
              `document.createTextNode('Hello, world!');`,
              `document.createDocumentFragment();`,
            ].join('\n')}
          </Code>,
          <Link
            to="https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement"
            text="MDN document.createElement"
          />,
        ],
      },
      {
        title: 'render',
        children: [
          <Code language="javascript">
            {getFunction(
              require('!!raw-loader!react/render').default,
              'renderVNode'
            )}
          </Code>,
        ],
      },
      {
        title: 'renderDOM',
        children: [
          <Code language="javascript">
            {getFunction(
              require('!!raw-loader!react/render').default,
              'renderDOM'
            )}
          </Code>,
        ],
      },
      {
        title: '🤔 updating the rendered html',
        children: [
          <p>• re-render the entire page after any change</p>,
          <p>
            • use window.requestAnimationFrame to render and wait for changes
          </p>,
          <div>¯\_(ツ)_/¯</div>,
        ],
      },
      {
        title: '✅ reconciling!',
        children: [
          <p>
            We can "reconcile" the current state of the DOM to match what the
            updated VDOM is
          </p>,
        ],
      },
      {
        title: 'reconcileTree',
        children: [
          <p>
            In order to reconcile the old and new dom, we needed a way to
            uniquely identify each element in the DOM.
          </p>,
          <Code language="javascript">
            {getFunction(
              require('!!raw-loader!react/reconcile-tree').default,
              'computeKey'
            )}
          </Code>,
          <p>
            We handle added, removed, and changed children in all separate
            cases.
          </p>,
        ],
      },
      {
        title: 'reconcileTree',
        children: [
          <p>Handle removed children:</p>,
          <Code language="javascript">
            {getBlockAfter(
              require('!!raw-loader!react/reconcile-tree').default,
              '// handle removed'
            )}
          </Code>,
        ],
      },
      {
        title: 'reconcileTree',
        children: [
          <p>Handle added children:</p>,
          <Code language="javascript">
            {getBlockAfter(
              require('!!raw-loader!react/reconcile-tree').default,
              '// handle added'
            )}
          </Code>,
        ],
      },
      {
        title: 'reconcileTree',
        children: [
          <p>Handle changed children:</p>,
          <Code language="javascript">
            {getBlockAfter(
              require('!!raw-loader!react/reconcile-tree').default,
              '// handle changed'
            )}
          </Code>,
        ],
      },
      {
        children: [<Thanks />],
      },
    ];

    return (
      <div class="App">
        <Slideshow
          slides={slides.map((slide, i) => (
            <Slide key={`slide-${i}`}>
              <Slide.Title title={slide.title} />
              {slide.children}
            </Slide>
          ))}
        />
      </div>
    );
  }
}
