function uniq(arr) {
    let temp = [];

    if (arr.length) {
        arr.map((item) => {
            temp.includes(item) === false && temp.push(item);
        })
    }

    return temp;
}

function insertTree(rootData, data) {
    if (rootData.id === data.parentId) {
        if (!rootData.children) {
            rootData.children = [];
        };

        rootData.children.push(data);
    } else {
        if (rootData.children && rootData.children.length) {
            $.each(rootData.children, function (i, item) {
                insertTree(item, data);
            })
        };
    }
}

export function conversionTree(original) {
    const data = original.map((item) => { return $.extend({}, item) });
    let tree = [];
    let rootLevel = [];

    if (data.length) {
        data.map((item) => {
            rootLevel.push(item.level);

            if (item.id === item.rootId) {
                tree.push(item)
            } else {
                const rootItem = tree.find((treeItem) => { return item.rootId === treeItem.id })

                if (rootItem) {
                    insertTree(rootItem, item);
                }
            }
        })
    }

    return tree;
}

function insertOrg(rootData, data) {
    if (rootData.cId === data.cParentId) {
        if (!rootData.children) {
            rootData.children = [];
        };

        rootData.children.push(data);
    } else {
        if (rootData.children && rootData.children.length) {
            $.each(rootData.children, function (i, item) {
                insertOrg(item, data);
            })
        };
    }
}

export function conversionOrg(original) {
    const data = original.map((item) => { return $.extend({}, item) });
    let tree = [];
    let rootLevel = [];

    if (data.length) {
        $.each(data, function (i, item) {
            rootLevel.push(item.level);

            if (i === 0) {
                if (item.cId === item.cRootId) {
                    tree.push(item)
                } else {
                    const temp = { cId: item.cRootId, children: [] }

                    temp.children.push(item)
                    tree.push(temp)
                }
            } else {
                const rootItem = tree.find((treeItem) => { return item.cRootId === treeItem.cId })

                if (rootItem) {
                    insertOrg(rootItem, item);
                }
            }
        })
    }

    rootLevel = uniq(rootLevel);

    return {
        original,
        tree,
        rootLevel: rootLevel.length ? Math.min(...rootLevel) : null
    };
}

function insertFunc(rootData, data) {
    if (rootData.cId === data.cParentId) {
        if (data.cCommandTypeId) {
            if (!rootData.action) {
                rootData.action = [];
            };

            rootData.action.push(data);
        } else {
            if (!rootData.children) {
                rootData.children = [];
            };

            rootData.children.push(data);
        }
    } else {
        if (rootData.children && rootData.children.length) {
            rootData.children.map((item) => {
                insertFunc(item, data);
            })
        };
    }
}

export function conversionFunc(original) {
    const data = original.map((item) => { return $.extend({}, item) });
    let tree = [];

    if (data.length) {
        data.map((item) => {
            if (item.cId === item.cRootId) {
                tree.push(item);
            } else {
                const rootItem = tree.find((treeItem) => { return item.cRootId === treeItem.cId })

                if (rootItem) {
                    insertFunc(rootItem, item);
                }
            };
        })
    }

    return tree;
}