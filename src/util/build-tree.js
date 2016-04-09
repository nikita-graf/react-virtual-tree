import Tree from './tree';

export default ({
  items,
  levels,
  filter = () => true,
}) => {
  let nodes = [];
  let tree = new Tree(items, levels, filter);

  tree.traverse(function (node) {
    nodes.push(node);
  });

  return nodes;
};
