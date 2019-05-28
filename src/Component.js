export default class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  setState = (state, callbackFn) => {
    this.state = state;
    this.forceUpdate();
    callbackFn && callbackFn();
  };

  forceUpdate = () => {
    const newElem = this._vnode._render(this.render(this.props, this.state));
    this._vnode._root.replaceWith(newElem);
    this._vnode._root = newElem;
  };

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}

  render() {}
}