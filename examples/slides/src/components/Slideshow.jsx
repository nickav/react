import React from 'react';

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
      case 'Enter':
      case ' ': {
        return e.shiftKey ? this.prevSlide() : this.nextSlide();
      }

      case 'd':
      case 'ArrowRight':
      case 'n': {
        return this.nextSlide();
      }

      case 'a':
      case 'ArrowLeft':
      case 'p': {
        return this.prevSlide();
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
    return (
      <div class="slideshow">
        {React.isValidElement(Slide) ? Slide : <Slide key={`slide-${index}`} />}
      </div>
    );
  }
}
