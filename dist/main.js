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
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nigeria Tax API')
        .setDescription('API to manage Nigerian tax categories and calculations')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('elor', app, document);
    await app.listen(7777);
    console.log(`App is running at ${await app.getUrl()}`);
    console.log(`Current environment is ${process.env.NODE_ENV}`);
}
bootstrap();
