export function clone(item) {
  return JSON.parse(JSON.stringify(item))
}

export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export default {
  clone,
  sleep,
}