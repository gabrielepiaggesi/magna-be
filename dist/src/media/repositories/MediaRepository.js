"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
class MediaRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "medias";
    }
}
exports.MediaRepository = MediaRepository;
//# sourceMappingURL=MediaRepository.js.map