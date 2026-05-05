import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Express middleware factory that validates a request property against a Zod schema.
 * Returns 400 with structured error details on validation failure.
 *
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate ('body' | 'params' | 'query')
 */
export function validate(schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    // Replace the raw value with the parsed (and potentially transformed) value
    if (source === 'body') {
      req.body = result.data;
    } else if (source === 'params') {
      req.params = result.data as typeof req.params;
    } else {
      req.query = result.data as typeof req.query;
    }

    next();
  };
}
