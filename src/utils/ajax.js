import 'whatwg-fetch'
import {$} from '../vendor';

const AJAX_PATH = '/web/ajax';

export default function (url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: AJAX_PATH + url,
      method: 'POST',
      data: data || null,
      dataType: 'json'
    }).done((data) => {
      if (data.code === 200) {
        resolve(data.data);
      } else {
        reject({
          errCode: data.code,
          errText: data.detail
        });
      }
    }).fail((jqXHR) => {
      reject({
        errCode: jqXHR.status,
        errText: jqXHR.statusText
      });
    });
  })
}