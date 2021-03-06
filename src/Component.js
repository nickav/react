import reconcileTree from './reconcile-tree';

export default class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this._vnode = null;
  }

  setState = (state, callbackFn) => {
    this.state = state;

    if (this.shouldComponentUpdate(this.props, state)) {
      this.forceUpdate();
    }

    callbackFn && callbackFn();
  };

  forceUpdate = () => {
    const prevProps = this.props;
    const prevState = this.state;
    this.componentWillReceiveProps(this.props, this.state);

    const nextVNode = this.render(this.props, this.state);
    nextVNode._dom = this._vnode._dom;
    reconcileTree(nextVNode, this._vnode._prevVNode);
    this._vnode._prevVNode = nextVNode;

    this.componentDidUpdate(prevProps, prevState);
  };

  getRef() {
    return this._vnode && this._vnode._dom;
  }

  // lifecycle methods

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps, nextState) {}

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState) {}

  render() {}
}
