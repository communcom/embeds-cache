const Redis = require('ioredis');
const fetch = require('node-fetch');
const core = require('cyberway-core-service');
const BasicController = core.controllers.Basic;
const { Logger } = core.utils;
const { encodeKey } = require('../utils/RedisKey');
const env = require('../data/env');

class Cache extends BasicController {
    constructor({ connector }) {
        super({ connector });

        this._redis = new Redis({
            port: env.GLS_REDIS_PORT,
            host: env.GLS_REDIS_HOST,
            family: 4, // IPv4
            password: env.GLS_REDIS_PASSWORD,
            db: 0,
        });
    }

    async getEmbed({ type, url }) {
        const key = encodeKey({ type, url });

        const result = await this._getFromRedis({ key });

        if (result) {
            return result;
        }

        const embed = await this._callIframely({ type, url });

        this._storeInRedis({ key, value: embed }).catch(error => {
            Logger.error('Error during setting data in Redis:', error);
        });

        return embed;
    }

    async _storeInRedis({ key, value }) {
        const encodedValue = JSON.stringify(value);

        return this._redis.set(key, encodedValue, 'EX', env.GLS_CACHE_TTL_SEC);
    }

    async _getFromRedis({ key }) {
        const encoded = await this._redis.get(key);
        return JSON.parse(encoded);
    }

    async _callIframely({ type, url }) {
        const embedUrl = `${env.GLS_IFRAMELY_CONNECT}/${type}?url=${url}`;

        try {
            const response = await fetch(embedUrl);

            if (!response.ok) {
                throw {
                    code: 1102,
                    message: 'Iframely error',
                    error: await response.text(),
                };
            }

            return await response.json();
        } catch (err) {
            Logger.error('Iframely error:', err);
            throw err;
        }
    }
}

module.exports = Cache;
