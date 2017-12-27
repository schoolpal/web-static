export default function (url, data) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => {
        if (res.status === 200) {
          res.json()
        } else {
          reject(`${res.status}: ${res.statusText}`)
        }
      })
      .then(data => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}