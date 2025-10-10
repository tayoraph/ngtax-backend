"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/filters/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    //  app.setGlobalPrefix('nest-basic')
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const routes = router.stack
        .filter((r) => r.route)
        .map((r) => `${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nigeria Tax API')
        .setDescription('API to manage Nigerian tax categories and calculations')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('eltax', app, document);
    var port = process.env.PORT || 7777;
    await app.listen(port);
    console.log(`App is running at ${await app.getUrl()}`);
    console.log(`Current environment is ${process.env.NODE_ENV}`);
}
bootstrap();
//# sourceMappingURL=main.js.map