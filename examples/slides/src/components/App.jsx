import React from 'react';
import Slideshow, { Slide } from './Slideshow';
import Code from './Code';

const createElementSrc = `const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});`;

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
        children: () => <Code class="javascript">{createElementSrc}</Code>,
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
