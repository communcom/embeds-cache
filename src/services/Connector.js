const core = require('cyberway-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env');
const CacheController = require('../controllers/Cache');

class Connector extends BasicConnector {
    constructor() {
        super();

        this._cache = new CacheController({ connector: this });
    }

    async start() {
        await super.start({
            serverRoutes: {
                getEmbed: {
                    handler: this._cache.getEmbed,
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
