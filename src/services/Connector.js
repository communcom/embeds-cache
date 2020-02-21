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
                    validation: {
                        required: ['url'],
                        properties: {
                            type: {
                                type: 'string',
                                enum: ['oembed', 'iframely'],
                                default: 'oembed',
                            },
                            url: {
                                type: 'string',
                                minLength: 1,
                            },
                        },
                    },
                },
            },
            requiredClients: {
                iframely: env.GLS_IFRAMELY_CONNECT,
            },
        });
    }
}

module.exports = Connector;
