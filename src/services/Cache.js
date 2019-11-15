const core = require('cyberway-core-service');
const BasicService = core.services.Basic;
const env = require('../data/env');

class Cache extends BasicService {
    constructor(...args) {
        super(...args);
    }

    async start() {
        await this.startLoop(0, env.GLS_CACHE_ENSURE_INTERVAL);
    }

    async stop() {
        this.stopLoop();
    }

    async iteration() {}
}

module.exports = Cache;
