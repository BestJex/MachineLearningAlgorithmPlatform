export default {
  payload_decode(utf8_token) {
    // validation
    if (typeof utf8_token !== 'string') throw 'Invalid token specified'
    let arr = utf8_token.split('.')
    if (arr.length !== 3) throw 'Illegal JWT token.'
    let payload = arr[1]

    // decode
    let decoded = payload.replace(/-/g, "+").replace(/_/g, "/");
    switch (decoded.length % 4) {
      case 0:
        break
      case 2:
        decoded += "=="
        break
      case 3:
        decoded += "="
        break
      default:
        throw "Illegal base64url string!"
    }

    // atob
    let result = (input => {
      let str = String(input).replace(/=+$/, '')
      if (str.length % 4 === 1) throw "The string to be decoded is not correctly encoded."
      let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      for (
        var bc = 0, bs, buffer, idx = 0, output = '';
        buffer = str.charAt(idx++);
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        buffer = chars.indexOf(buffer)
      }
      return output
    })(decoded).replace(/(.)/g, (_, p) => {
      let code = p.charCodeAt(0).toString(16).toUpperCase()
      return '%' + (code.length < 2 ? '0' + code : code)
    })
    return JSON.parse(decodeURIComponent(result))
  }
}