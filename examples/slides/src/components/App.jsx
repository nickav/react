import * as React from 'react';
import Slideshow, { Slide } from './Slideshow';

import './App.css';

const createElementSrc = `
const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});
`;

const Code = ({ children }) => (
  <pre class="code">
    <code>{children}</code>
  </pre>
);

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
        children: () => <Code>{createElementSrc}</Code>,
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
