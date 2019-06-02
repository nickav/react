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
        children: () => [
          <Code language="html">{`<div><h1 style="color: red">Hello, world!</h1></div>`}</Code>,
          <div>
            <h1 style="color: red">Hello, world!</h1>
          </div>,
          <Code language="javascript">{`const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});`}</Code>,
          <div>
            <Link to="https://babeljs.io/">Babel</Link> transforms any html tags
            in JSX into...
          </div>,
          <Code language="javascript">{`createElement('div', null, createElement('h1', { style: 'color: red' }, 'Hello, world!'))`}</Code>,
          <Link to="https://jasonformat.com/wtf-is-jsx/">
            https://jasonformat.com/wtf-is-jsx/
          </Link>,
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
