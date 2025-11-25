import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to extract and validate sube ID from request
 * Adds subeId to request object for use in routes
 */
export interface SubeRequest extends Request {
  subeId?: number;
}

export function subeMiddleware(req: SubeRequest, res: Response, next: NextFunction) {
  // Şube ID'sini header'dan veya query'den al
  const subeIdHeader = req.headers['x-sube-id'];
  const subeIdQuery = req.query.sube_id as string;
  
  let subeId: number | undefined;
  
  if (subeIdHeader) {
    subeId = parseInt(subeIdHeader as string, 10);
  } else if (subeIdQuery) {
    subeId = parseInt(subeIdQuery, 10);
  }
  
  // Şube ID geçerliyse request'e ekle
  if (subeId && !isNaN(subeId)) {
    req.subeId = subeId;
  }
  
  next();
}

