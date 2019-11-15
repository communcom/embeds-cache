const env = process.env;

module.exports = {
    GLS_IFRAMELY_CONNECT: env.GLS_IFRAMELY_CONNECT,
    GLS_CACHE_ENSURE_INTERVAL: env.GLS_CACHE_ENSURE_INTERVAL || 2000,
};
