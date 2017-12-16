export default function (nodeList) {
  if (nodeList && nodeList.length) {
    return Array.prototype.slice.call(nodeList);
  }

  return [];
}