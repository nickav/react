import diffTree from './diff-tree';

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
    const nextVNode = this.render(this.props, this.state);
    nextVNode._root = this._vnode._root;
    diffTree(nextVNode, this._vnode._prevVNode);
    this._vnode._prevVNode = nextVNode;
  };

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps, nextState) {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {}
}
