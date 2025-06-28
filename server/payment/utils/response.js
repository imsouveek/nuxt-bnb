export function sendJSON (res, data, status = 200) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = status
    res.end(JSON.stringify(data))
}
