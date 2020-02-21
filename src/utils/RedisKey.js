const normalizeUrl = require('normalize-url');

function encodeKey({ type, url }) {
    return `${normalizeUrl(url)}<${type}>`;
}

module.exports = { encodeKey };
