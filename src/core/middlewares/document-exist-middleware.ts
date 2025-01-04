import {NextFunction, Request, Response} from 'express';
import {Middleware} from './middleware.interface.js';
import {HttpError} from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {DocumentExist} from '../../types/document-exist.interface.js';

export class DocumentExistMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExist,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {
  }

  public async execute({params}: Request, _response: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistMiddleware'
      );
    }

    next();
  }
}
