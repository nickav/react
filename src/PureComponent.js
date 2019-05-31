import Component from './Component';

const shallowDiff = (a, b) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every((key) => a[key] === b[key]);
};

export default class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      shallowDiff(this.props, nextProps) || shallowDiff(this.state, nextState)
    );
  }
}
