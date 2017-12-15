export default function getSimpleGroup() {
  return {
    "code": 200,
    "data": [{
      "cId": "16010100000001",
      "cName": "校客科技",
      "cParentId": "16010100000001",
      "cRootId": "16010100000001",
      "level": 0,
      "parent": true
    }, {
      "cId": "16122700000032",
      "cName": "瑞思教育",
      "cParentId": "16010100000001",
      "cRootId": "16010100000001",
      "level": 1,
      "parent": true
    }, {
      "cId": "16122700000033",
      "cName": "瑞思北京分公司",
      "cParentId": "16122700000032",
      "cRootId": "16010100000001",
      "level": 2,
      "parent": true
    }, {
      "cId": "16122700000034",
      "cName": "瑞思石景山台湾街校区",
      "cParentId": "16122700000033",
      "cRootId": "16010100000001",
      "level": 3,
      "parent": false
    }, {
      "cId": "16122700000035",
      "cName": "瑞思门头沟滨河校区",
      "cParentId": "16122700000033",
      "cRootId": "16010100000001",
      "level": 3,
      "parent": false
    }],
    "detail": "Ok"
  }
}