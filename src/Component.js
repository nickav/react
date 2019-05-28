import diffTree from "./diff-tree";


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

    console.log('about to diff', this._vnode._prevVNode, nextVNode);
    diffTree(this._vnode._prevVNode, nextVNode);

    const newElem = this._vnode._render(nextVNode);
    this._vnode._root.replaceWith(newElem);
    this._vnode._root = newElem;
    this._vnode._prevVNode = nextVNode;
  };

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {}
}