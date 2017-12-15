export default function () {
  return {
    code: 200,
    data: [
      {
        cId: "16010100000001",
        cName: "校客科技",
        cAddress: "上地软件园1号",
        cState: "北京市",
        cCity: "海淀区",
        cCounty: "",
        cOwner: "曹磊",
        cOwnerPhone: "13666666666",
        cParentId: "16010100000001",
        cRootId: "16010100000001",
        level: 0,
        parent: true
      },
      {
        cId: "16122700000032",
        cName: "瑞思教育",
        cAddress: "国信嘉禾大厦2层",
        cState: "北京市",
        cCity: "东城区",
        cCounty: "",
        cOwner: "孙一丁",
        cOwnerPhone: "12340981234",
        cParentId: "16010100000001",
        cRootId: "16010100000001",
        level: 1,
        parent: true
      },
      {
        cId: "16122700000033",
        cName: "瑞思北京分公司",
        cAddress: "广渠门",
        cState: "北京市",
        cCity: "东城区",
        cCounty: "",
        cOwner: "武玥",
        cOwnerPhone: "13801012223",
        cParentId: "16122700000032",
        cRootId: "16010100000001",
        level: 2,
        parent: true
      },
      {
        cId: "16122700000034",
        cName: "瑞思石景山台湾街校区",
        cAddress: "鲁谷路台湾街C区10号",
        cState: "北京市",
        cCity: "石景山区",
        cCounty: "",
        cOwner: "李彤",
        cOwnerPhone: "12301102222",
        cParentId: "16122700000033",
        cRootId: "16010100000001",
        level: 3,
        parent: false
      },
      {
        cId: "16122700000035",
        cName: "瑞思门头沟滨河校区",
        cAddress: "滨河大厦207",
        cState: "北京市",
        cCity: "门头沟区",
        cCounty: "",
        cOwner: "张甲",
        cOwnerPhone: "13810102200",
        cParentId: "16122700000033",
        cRootId: "16010100000001",
        level: 3,
        parent: false
      }
    ],
    detail: "Ok"
  };
}
