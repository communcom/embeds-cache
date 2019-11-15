const core = require('cyberway-core-service');
const BasicMain = core.services.BasicMain;
const { Logger } = core.utils;
const env = require('./data/env');
const Connector = require('./services/Connector');

class Main extends BasicMain {
    constructor() {
        super(env);
        const connector = new Connector();
        this.addNested(connector);
    }
}

module.exports = Main;
