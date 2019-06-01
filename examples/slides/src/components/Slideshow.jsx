import * as React from 'react';

import './Slideshow.css';

export class Slide extends React.Component {
  static Title = ({ title, children }) => (
    <div class="title">{title || children}</div>
  );

  render() {
    const { children } = this.props;

    return <div class="slide">{children}</div>;
  }
}

export default class Slideshow extends React.Component {
  state = { index: 0 };

  componentWillMount() {
    this.removeEventListeners = React.bindListeners(window, {
      keydown: this.onKeyDown,
    });
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  onKeyDown = (e) => {
    switch (e.key) {
      case 'n': {
        this.nextSlide();
        return;
      }

      case 'p': {
        this.prevSlide();
        return;
      }
    }
  };

  nextSlide = () => {
    const { slides } = this.props;
    const nextIndex = this.state.index + 1;
    this.setState({ index: nextIndex < slides.length ? nextIndex : 0 });
  };

  prevSlide = () => {
    const { slides } = this.props;
    const prevIndex = this.state.index - 1;
    this.setState({ index: prevIndex >= 0 ? prevIndex : slides.length - 1 });
  };

  render() {
    const { index } = this.state;
    const { slides } = this.props;
    const Slide = slides[index];
    console.log({ index, Slide });
    // TODO: allow this to be rendered with the tag syntax too?
    return <div class="slideshow">{Slide}</div>;
  }
}
