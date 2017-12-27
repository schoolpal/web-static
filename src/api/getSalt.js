import 'whatwg-fetch'
import ajax from "../utils/ajax";

export default function (query) {
  const url = "http://localhost:3001";

  return ajax(url)
}