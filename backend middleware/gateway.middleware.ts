import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response, NextFunction } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('[GATEWAY] URL completa:', req.originalUrl);
    console.log('[GATEWAY] Recibida solicitud:', req.method, req.url);

    // Usar originalUrl en lugar de url
    const fullPath = req.originalUrl.split('?')[0]; // Elimina query params para verificación

    // Si la ruta no pertenece a los microservicios gestionados por el gateway, dejarla pasar:
    if (
      !fullPath.startsWith('/reservas') &&
      !fullPath.startsWith('/casilleros') &&
      !fullPath.startsWith('/auth')
    ) {
      console.log('[GATEWAY] Ruta no gestionada por gateway, pasando al siguiente middleware');
      return next();
    }

    // Rutas de auth las enviamos solo al primario (3001) y NO intentamos failover al espejo
    const isAuthRoute = fullPath.startsWith('/auth');

    // Si es ruta de auth, no intentamos espejo
    if (isAuthRoute) {
      try {
        const serviceUrl = this.getServiceUrl(req, fullPath);
        console.log('[GATEWAY] (AUTH) Peticion al primario 3001:', serviceUrl);

        const headers = this.getForwardHeaders(req);

        const response = await lastValueFrom(
          this.httpService.request({
            url: serviceUrl,
            method: req.method as any,
            data: req.body,
            headers: headers,
            params: req.query,
          })
        );

        console.log('[GATEWAY] (AUTH) Respuesta del primario recibida con status:', response.status);
        return res.status(response.status).json(response.data);
      } catch (errAuth) {
        console.log('[GATEWAY] (AUTH) Error en primario:', (errAuth as any).message || errAuth);
        return res.status(503).json({
          error: 'Servicio de autenticación no disponible',
          message: 'El servicio de autenticación del primario no está disponible',
        });
      }
    }

    // Comportamiento habitual con failover para reservas y casilleros
    try {
      const serviceUrl = this.getServiceUrl(req, fullPath);
      console.log('[GATEWAY] Peticion al puerto primario 3001:', serviceUrl);

      const headers = this.getForwardHeaders(req);

      const response = await lastValueFrom(
        this.httpService.request({
          url: serviceUrl,
          method: req.method as any,
          data: req.body,
          headers: headers,
          params: req.query,
        })
      );

      console.log('[GATEWAY] Respuesta del primario recibida con status:', response.status);
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.log('[GATEWAY] Error en primario:', (error as any).message || error);
      console.log('');
      console.log('[GATEWAY] Intentando failover al espejo...');
      console.log('');
      try {
        const mirrorUrl = this.getMirrorServiceUrl(req, fullPath);
        console.log('[GATEWAY] Peticion al puerto espejo 3002:', mirrorUrl);

        const headers = this.getForwardHeaders(req);

        const mirrorResponse = await lastValueFrom(
          this.httpService.request({
            url: mirrorUrl,
            method: req.method as any,
            data: req.body,
            headers: headers,
            params: req.query,
          })
        );

        console.log('[GATEWAY] Respuesta del espejo recibida con status:', mirrorResponse.status);
        return res.status(mirrorResponse.status).json(mirrorResponse.data);
      } catch (errMirror) {
        console.log('[GATEWAY] El espejo también falló:', (errMirror as any).message || errMirror);
        return res.status(503).json({
          error: 'Servicios no disponibles',
          message: 'Tanto el servicio primario como el espejo fallaron',
          details: (errMirror as any).message,
        });
      }
    }
  }

  private getForwardHeaders(req: Request): any {
    const headersToForward = [
      'content-type',
      'authorization',
      'accept',
      'user-agent',
    ];

    const headers: any = {};
    headersToForward.forEach((header) => {
      const value = req.headers[header];
      if (value) {
        headers[header] = value;
      }
    });

    return headers;
  }

  private getServiceUrl(req: Request, fullPath: string): string {
    if (fullPath.startsWith('/reservas')) {
      return `http://localhost:3001${fullPath}`;
    }

    if (fullPath.startsWith('/casilleros')) {
      return `http://localhost:3001${fullPath}`;
    }

    if (fullPath.startsWith('/auth')) {
      return `http://localhost:3001${fullPath}`;
    }

    throw new Error(`Ruta no reconocida en gateway: ${fullPath}`);
  }

  private getMirrorServiceUrl(req: Request, fullPath: string): string {
    if (fullPath.startsWith('/reservas')) {
      return `http://localhost:3002${fullPath}`;
    }

    if (fullPath.startsWith('/casilleros')) {
      return `http://localhost:3002${fullPath}`;
    }

    throw new Error(`Ruta no reconocida en gateway (mirror): ${fullPath}`);
  }
}