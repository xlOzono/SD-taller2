import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response, NextFunction } from 'express';
import { firstValueFrom } from 'rxjs';

// 🛑 Configuración de Puertos
const PRIMARY_URL = 'http://localhost:3001'; // Microservicio Principal (Servicios A)
const MIRROR_URL = 'http://localhost:3002';  // Microservicio Espejo (Servicios B)

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Gateway @3000] Solicitud recibida: ${req.method} ${req.url}`);

    // Identifica las rutas de los servicios.
    // Si la solicitud va al Gateway, debe comenzar con /reservas, /casilleros, etc.
    const isServiceRoute = 
        req.url.startsWith('/reservas') || 
        req.url.startsWith('/casilleros') ||
        req.url.startsWith('/login') ||
        req.url.startsWith('/registro');
    
    // Si la ruta no es de un servicio que deba ser enrutado, pasa al siguiente handler local.
    if (!isServiceRoute) {
      return next(); 
    }

    // 🛑 INICIO DE LA LÓGICA DE FAILOVER GLOBAL

    try {
      // 1. Intento PRIMARIO (http://localhost:3001)
      const response = await this.sendRequest(req, PRIMARY_URL);
      
      // Éxito: Envía la respuesta al cliente
      res.status(response.status).send(response.data);
      
    } catch (error) {
      // Fallo en el Primario, pasar al Espejo
      console.warn(`[Failover] Primary (${PRIMARY_URL}) falló. Redirigiendo a Mirror...`);
      
      try {
        // 2. Intento ESPEJO (http://localhost:3002)
        const mirrorResponse = await this.sendRequest(req, MIRROR_URL);
        
        // Éxito en el Espejo: Envía la respuesta al cliente
        res.status(mirrorResponse.status).send(mirrorResponse.data);

      } catch (mirrorError) {
        // 3. Fallo Total
        console.error(`[Failover] El Mirror (${MIRROR_URL}) también falló. Sistema no disponible.`);
        res.status(503).json({ 
          error: 'Servicios de Negocio no disponibles', 
          message: 'Ambos servidores Primario y Espejo fallaron la solicitud.' 
        });
      }
    }
  }

  // --- Helper para enviar la petición ---
  private async sendRequest(req: Request, baseUrl: string) {
      // La URL completa incluye la base y el path original de la solicitud (Ej: http://localhost:3001/reservas/usuario/1)
      const fullUrl = `${baseUrl}${req.url}`;
      
      return firstValueFrom(
          this.httpService.request({
              url: fullUrl,
              method: req.method as any,
              data: req.body,
              headers: req.headers as any, 
              params: req.query as any, 
          }),
      );
  }
}