import SCHOOLPAL_CONFIG from "./config";

const ADMIN_ID = "7";

function getRootMenu(item, index, array) {
  return item.cId === item.cParentId && item.cId === item.cRootId;
}

export default function profileProcess(data) {
  let hasChangeGroupBtn = true;
  let menu = [];
  let func = [];
  let command = [];
  let access = [];

  data.roles.map(item => {
    func = func.concat(item.functions);
  });

  menu = func.filter(getRootMenu);

  menu.map(item => {
    item.children = [];

    item.children = func.filter(children => {
      return (
        children.cId !== children.cParentId && item.cId === children.cParentId
      );
    });

    if (item.cRootId === ADMIN_ID) {
      hasChangeGroupBtn = false;
    }
  });

  func.filter(item => {
    if (
      SCHOOLPAL_CONFIG.AUTH[item.cId] &&
      SCHOOLPAL_CONFIG.AUTH[item.cId].PATH_RULE !== undefined
    ) {
      access.push(SCHOOLPAL_CONFIG.AUTH[item.cId].PATH_RULE);
    }

    if (item.WidgetType === "MenuItem") {
      command.push({
        id: item.cId,
        rule: SCHOOLPAL_CONFIG.AUTH[item.cId].PATH_RULE,
        commands: []
      });
    }

    if (item.WidgetType === "Command") {
      const index = command.findIndex(cmd => {
        return cmd.id === item.cParentId;
      });

      if (index + 1) {
        command[index].commands.push(item.CommandCode);
      }
    }
  });

  console.log(hasChangeGroupBtn, menu, access, command);
  return {hasChangeGroupBtn, menu, access, command};
}
