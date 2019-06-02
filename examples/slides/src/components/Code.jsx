import React from 'react';
import './Code.css';

export default class Code extends React.Component {
  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    this.el.querySelectorAll('code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }

  setEl = (el) => {
    this.el = el;
  };

  render() {
    const { children, class: cn, language } = this.props;
    return (
      <pre class={`code ${cn}`} ref={this.setEl}>
        <code class={`hljs ${language}`}>{children}</code>
      </pre>
    );
  }
}
