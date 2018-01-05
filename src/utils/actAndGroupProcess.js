function insertAct(rootData, data) {
  if (rootData.id === data.cParentId) {
    if (!rootData.children) {
      rootData.children = [];
    }

    rootData.children.push({
      id: data.id,
      name: data.name,
      parentId: data.parentId,
      type: 'act',
    });
  } else {
    if (rootData.children && rootData.children.length) {
      rootData.children.map(item => {
        insertAct(item, data);
      });
    }
  }
}

function getActTree(data) {
  let act = [];

  data.map((item, index) => {
    if (item.id === item.rootId) {
      act.push({
        id: item.id,
        parentId: item.parentId,
        name: item.name,
        type: 'act',
      });
    } else {
      const rootItem = act.filter(actItem => (item.rootId === actItem.id));

      if (rootItem.length) {
        rootItem.map(root => {
          insertAct(root, item);
        });
      }
    }
  });

  return act;
}

export default function (data) {
  let act = [];

  data.orgList.map((org) => {
    if (data.actListMap[org.cId].length) {
      const temp = {
        id: org.cId,
        name: org.cName,
        type: 'group',
        children: getActTree(data.actListMap[org.cId])
      };

      act.push(temp)
    }
  });

  return act;
}