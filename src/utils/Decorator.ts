import 'reflect-metadata';

export function Post() {
    const decorator: MethodDecorator = (target, propertyKey, description) => {
        Reflect.defineMetadata('METHOD', 'POST', target, propertyKey);
    };
    return decorator;
}

export function Get() {
    const decorator: MethodDecorator = (target, propertyKey, description) => {
        Reflect.defineMetadata('METHOD', 'GET', target, propertyKey);
    };
    return decorator;
}

export function Path(path: string) {
    const decorator: MethodDecorator = (target, propertyKey, description) => {
        Reflect.defineMetadata('PATH', path, target, propertyKey);
    };
    return decorator;
}

export function Multer(config: {multerConfig: any, path?: string, type?: 'single' | 'multiple'}) {
    const decorator: MethodDecorator = (target, propertyKey, description) => {
        Reflect.defineMetadata('MULTER', config, target, propertyKey);
    };
    return decorator;
}