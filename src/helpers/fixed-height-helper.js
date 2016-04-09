import CommonHelper from './common-helper';

export default class FixedHeightHelper extends CommonHelper {
  init(ready) {
    ready();
  }

  getItemHeight() {
    return this.component.props.itemHeight;
  }

  getVisibleNodesCount() {
    let { itemHeight } = this.component.props;
    let { height } = this.component.state;

    return Math.ceil(height / itemHeight) + 1;
  }

  getRawNodeIndexAtPosition(position) {
    let { itemHeight } = this.component.props;

    return Math.floor(position / itemHeight);
  }

  getScrollHeight() {
    let { itemHeight } = this.component.props;
    let { nodes } = this.component.state;

    return itemHeight * nodes.length;
  }

  getPositionByItemIndex(index) {
    let { itemHeight } = this.component.props;

    return itemHeight * index;
  }
}
