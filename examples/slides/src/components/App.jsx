import React from 'react';

import Link from './Link';
import Slideshow, { Slide } from './Slideshow';
import Code from './Code';

export default class App extends React.Component {
  render() {
    const slides = [
      {
        title: '⚛ react from scratch',
      },
      {
        title: 'by anushiri, alan and nick',
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
          <Link to="https://jasonformat.com/wtf-is-jsx/">
            https://jasonformat.com/wtf-is-jsx/
          </Link>,
        ],
      },
      {
        title: '🖼 rendering',
        children: [
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
            {require('!!raw-loader!react/render').default}
          </Code>,
        ],
      },
      {
        title: '🤔 updating the rendered html',
        children: [
          <ul>
            <li>re-render the entire page after any change</li>
            <li>
              use window.requestAnimationFrame to render and wait for changes
            </li>
          </ul>,
          <div>¯\_(ツ)_/¯</div>,
        ],
      },
      {
        title: '✅ reconciling!',
        children: [
          <p>
            We know what the previous and next states are and we know what the
            DOM currently looks
          </p>,
          <p>
            We can "reconcile" the current state of the DOM to match what it
            should look like
          </p>,
        ],
      },
      {
        title: 'reconcileTree',
        children: [
          <Code language="javascript">
            {require('!!raw-loader!react/reconcile-tree').default}
          </Code>,
        ],
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
