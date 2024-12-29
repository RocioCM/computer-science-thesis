import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
