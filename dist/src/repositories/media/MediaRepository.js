"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const LOG = new Logger_1.Logger("MediaRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
class MediaRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "medias";
    }
}
exports.MediaRepository = MediaRepository;
//# sourceMappingURL=MediaRepository.js.map