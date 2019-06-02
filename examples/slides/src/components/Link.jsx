import React from 'react';

import './Link.css';

class Link extends React.Component {
  static isExternal = (link) => {
    const { origin } = window.location;
    const strLink = typeof link === 'object' ? link.pathname : link || '';

    return !strLink.startsWith('/') && !strLink.startsWith(origin);
  };

  render() {
    const { class: className, text, children, ...rest } = this.props;

    const external = Link.isExternal(rest.href || rest.to);

    const LinkComponent = external ? 'a' : rest.to ? 'div' : 'div';

    return (
      <LinkComponent
        class={className}
        target={external ? '_blank' : undefined}
        href={external ? rest.to || rest.href : undefined}
        {...rest}
      >
        {text || children}
      </LinkComponent>
    );
  }
}

export default Link;
