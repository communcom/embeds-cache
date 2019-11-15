const core = require('cyberway-core-service');
const BasicController = core.controllers.Basic;

class Cache extends BasicController {
    constructor({ connector, cacheService }) {
        super({ connector });

        this._cacheService = cacheService;
    }

    proxy({}) {}
}

module.exports = Cache;
