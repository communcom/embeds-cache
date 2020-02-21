const env = process.env;

module.exports = {
    GLS_IFRAMELY_CONNECT: env.GLS_IFRAMELY_CONNECT,
    GLS_CACHE_TTL_SEC: env.GLS_CACHE_TTL_SEC || 60 * 60 * 24,
    GLS_REDIS_HOST: env.GLS_REDIS_HOST || '0.0.0.0',
    GLS_REDIS_PORT: env.GLS_REDIS_PORT || '6379',
    GLS_REDIS_PASSWORD: env.GLS_REDIS_PASSWORD || null,
    GLS_WITHOUT_REDIS: Boolean(env.GLS_WITHOUT_REDIS) && env.GLS_WITHOUT_REDIS !== 'false',
};
