const host = process.env.HOSTNAME || 'localhost'
const port = '3000'
const isDev = () => __DEVCLIENT__ || __DEVSERVER__
// Replace with 'UA-########-#' or similar to enable tracking
const trackingID = null

export {
  host,
  port,
  trackingID,
  isDev
}
