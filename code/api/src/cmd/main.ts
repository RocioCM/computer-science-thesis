import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, BASE_PATH } from '../pkg/shared/constants';
import { FormatResponseInterceptor } from './format-response/format-response.interceptor';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api' + BASE_PATH);
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(PORT);

  console.log(
    `\x1b[36m \nApplication is running on: http://localhost:${PORT}/api${BASE_PATH} \x1b[0m\n`,
  );
}

bootstrap();
