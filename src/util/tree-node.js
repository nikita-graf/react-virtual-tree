let nodeId = 1;

export default class TreeNode {
  constructor(key, data, level) {
    this.id = nodeId++;
    this.level = level || 0;
    this.key = key;
    this.data = data;
    this.keyValueGetterName = typeof key === 'string'
      ? 'stringKeyValueGetter'
      : 'arrayKeyValueGetter';
    this.clear();
  }

  addChild(node) {
    let nodeKey = node.getKeyValue();
    let child = this.childrenKeys[nodeKey];

    if (child) {
      return child;
    } else {
      this.childrenKeys[nodeKey] = node;
      this.children.push(node);
      node.parent = this;
    }
  }

  stringKeyValueGetter() {
    return this.data[this.key];
  }

  arrayKeyValueGetter() {
    let result = '';

    for (let i = 0, length =  this.key.length; i < length; i++) {
      result += this.data[this.key[i]];
    }

    return result;
  }

  getKeyValue() {
    return this[this.keyValueGetterName]();
  }

  sort(sortFn) {
    this.children.sort(sortFn);
  }

  getChildByKey(key) {
    return this.childrenKeys[key];
  }

  clear() {
    this.children = [];
    this.childrenKeys = {};
    this.allChildrenCount = 0;
  }

  isLeaf() {
    return !this.children.length;
  }

  traverseRoot(callback, node = this) {
    let parent = this.parent;

    if (parent) {
      callback(parent, node);
      parent.traverseRoot(callback, node);
    }
  }

  traverse(callback) {
    if (this.data) {
      callback(this);
    }

    if (this.children.length) {
      this.children.forEach(function (child) {
        child.traverse(callback);
      });
    }
  }
}
