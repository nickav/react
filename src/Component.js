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
      // TODO: do we need this?
      //this.componentWillReceiveProps(this.props, state);
      this.forceUpdate();
    }

    callbackFn && callbackFn();
  };

  forceUpdate = () => {
    const nextVNode = this.render(this.props, this.state);
    nextVNode._root = this._vnode._root;
    reconcileTree(nextVNode, this._vnode._prevVNode);
    this._vnode._prevVNode = nextVNode;
  };

  // lifecycle methods
  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps, nextState) {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentDidUpdate(prevProps, prevState) {}

  getRoot() {
    return this._vnode._root;
  }

  render() {}
}
