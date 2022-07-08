"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function Post() {
    const decorator = (target, propertyKey, description) => {
        Reflect.defineMetadata('METHOD', 'POST', target, propertyKey);
    };
    return decorator;
}
exports.Post = Post;
function Get() {
    const decorator = (target, propertyKey, description) => {
        Reflect.defineMetadata('METHOD', 'GET', target, propertyKey);
    };
    return decorator;
}
exports.Get = Get;
function Path(path) {
    const decorator = (target, propertyKey, description) => {
        Reflect.defineMetadata('PATH', path, target, propertyKey);
    };
    return decorator;
}
exports.Path = Path;
//# sourceMappingURL=Decorator.js.map