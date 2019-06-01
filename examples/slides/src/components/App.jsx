import * as React from 'react';
import Slideshow, { Slide } from './Slideshow';

const createElementSrc = `
const createElement = (type, props = null, ...children) => ({
  type,
  props,
  children: [].concat(...children) || null,
});
`;

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
        children: () => <code>{createElementSrc}</code>,
      },
    ];

    return (
      <div class="App">
        <Slideshow
          slides={slides.map((slide, i) => (
            <Slide key={i}>
              <Slide.Title title={slide.title} />
              {slide.children}
            </Slide>
          ))}
        />
      </div>
    );
  }
}
