import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { logger } from 'src/pkg/shared/helpers/logger';

type APIResponse = {
  status: boolean;
  data: any;
  message: string;
};

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<APIResponse> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        logger('Formatter', data, response);
        const payload: APIResponse = {
          status: response?.statusCode,
          data: data || null,
          message: response?.statusMessage,
        };

        return payload;
      }),
    );
  }
}
