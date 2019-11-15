const core = require('cyberway-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env');
const CacheController = require('../controllers/Cache');
const CacheService = require('../services/Cache');

class Connector extends BasicConnector {
    constructor() {
        super();

        const cacheService = new CacheService();

        this._cache = new CacheController({ connector: this, cacheService });
    }

    async start() {
        await super.start({
            serverRoutes: {
                proxy: {
                    handler: this._cache.proxy,
                    scope: this._cache,
                },
            },
            requiredClients: {
                iframely: env.GLS_IFRAMELY_CONNECT,
            },
        });
    }
}

module.exports = Connector;
