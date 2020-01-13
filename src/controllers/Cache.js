const Redis = require('ioredis');
const fetch = require('node-fetch');
const urlValidator = require('valid-url');
const { camelCase } = require('lodash');
const core = require('cyberway-core-service');
const BasicController = core.controllers.Basic;
const { Logger } = core.utils;
const { encodeKey } = require('../utils/RedisKey');
const env = require('../data/env');

class Cache extends BasicController {
    constructor({ connector }) {
        super({ connector });

        if (!env.GLS_WITHOUT_REDIS) {
            this._redis = new Redis({
                host: env.GLS_REDIS_HOST,
                port: env.GLS_REDIS_PORT,
                family: 4, // IPv4
                password: env.GLS_REDIS_PASSWORD,
                db: 0,
            });
        }
    }

    async getEmbed({ type, url }) {
        this._validateUrlOrThrow(url);

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
        if (env.GLS_WITHOUT_REDIS) {
            return;
        }

        const encodedValue = JSON.stringify(value);

        return this._redis.set(key, encodedValue, 'EX', env.GLS_CACHE_TTL_SEC);
    }

    async _getFromRedis({ key }) {
        if (env.GLS_WITHOUT_REDIS) {
            return null;
        }

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

            const data = await response.json();

            return this._normalizeResult(data);
        } catch (err) {
            Logger.error('Iframely error:', err);
            throw err;
        }
    }

    _normalizeResult(originalResult) {
        const result = {};

        for (const keyName of Object.keys(originalResult)) {
            result[camelCase(keyName)] = originalResult[keyName];
        }

        if (result.type === 'rich') {
            result.type = 'embed';
        }

        if (result.type === 'link') {
            result.type = 'website';
        }

        if (result.type === 'photo') {
            result.type = 'image';
        }

        if (typeof result.providerName === 'string') {
            result.providerName = result.providerName.toLowerCase();
        }

        // Fix urls without schema
        if (result.thumbnailUrl && result.thumbnailUrl.startsWith('//')) {
            result.thumbnailUrl = 'http:' + result.thumbnailUrl;
        }

        return result;
    }

    _validateUrlOrThrow(url) {
        const urlIsValid = urlValidator.isWebUri(url);

        if (!urlIsValid) {
            throw {
                code: 1101,
                message: 'URL is not valid',
            };
        }
    }
}

module.exports = Cache;
