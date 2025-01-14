import * as crypto from 'node:crypto';
import * as jose from 'jose';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {TokenPayload} from '../../types/token-payload.type.js';
import {ValidationErrorDetails} from '../../types/validation-error-details.type.js';
import {ValidationError} from 'class-validator';
import {ServiceError} from '../../types/service-error.enum.js';
import {UnknownRecord} from '../../types/unknown-record.type.js';
import {DEFAULT_STATIC_IMAGES} from './constants.js';

export const createSHA256 = (line: string, salt: string): string => {
  const hmac = crypto.createHmac('sha256', salt);
  return hmac.update(line).digest('hex');
};

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});
}

export function createErrorObject(serviceError: ServiceError, message: string, details: ValidationErrorDetails[] = []) {
  return {
    errorType: serviceError,
    message,
    details: [...details],
  };
}

export async function createJWT(algorithm: string, jwtSecret: string, payload: TokenPayload): Promise<string> {
  return new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}

export function transformErrors(errors: ValidationError[]): ValidationErrorDetails[] {
  return errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  someObject: UnknownRecord,
  transformFn: (object: UnknownRecord) => void
) {
  return Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownRecord, transformFn);
      }
    });
}

export function transformObject(properties: string[], staticPath: string, uploadPath: string, data: UnknownRecord) {
  return properties
    .forEach((property) => {
      transformProperty(property, data, (target: UnknownRecord) => {
        const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
        target[property] = `${rootPath}/${target[property]}`;
      });
    });
}
