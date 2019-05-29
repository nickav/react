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
    console.log('forceUpdate!', this);

    const nextVNode = this.render(this.props, this.state);
    nextVNode._root = this._vnode._root;

    diffTree(nextVNode, this._vnode._prevVNode);
    
    this._vnode._prevVNode = nextVNode;

    //
    //console.log('nextVNode', nextVNode);

    //console.log('about to diff', this._vnode._prevVNode, nextVNode);
    //diffTree(this._vnode._prevVNode, nextVNode);

    // const newElem = this._vnode._render(nextVNode);
    // this._vnode._root.replaceWith(newElem);
    // this._vnode._root = newElem;
    // this._vnode._prevVNode = nextVNode;
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