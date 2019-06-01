import * as React from 'react';
import Slideshow, { Slide } from './Slideshow';

export default class App extends React.Component {
  render() {
    return (
      <div class="App">
        <Slideshow
          slides={[
            <Slide>
              <Slide.Title title="⚛ react from scratch" />
            </Slide>,
            <Slide>
              <Slide.Title title="by anushiri, alan and nick" />
            </Slide>,
          ]}
        />
      </div>
    );
  }
}
