import ajax from "../utils/ajax";

export default function (query) {
  const url = "/user/salt.do";

  return ajax(url)
}