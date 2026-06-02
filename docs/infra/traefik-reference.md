# Referencia Traefik — servidor compartido (granlogiamixta)

Patrón alineado con stacks Docker Compose que comparten una instancia Traefik en el host.

## Red externa

```bash
docker network ls | grep traefik
```

Convención en este despliegue:

| Variable | Valor por defecto |
|----------|-------------------|
| `TRAEFIK_NETWORK` | `traefik` |
| Red en compose | `external: true`, `name: ${TRAEFIK_NETWORK}` |

El servicio `comam-web` debe unirse a `comam_net` (interna) y a la red Traefik (pública).

## Labels en el servicio web

```yaml
labels:
  - traefik.enable=true
  - traefik.docker.network=${TRAEFIK_NETWORK:-traefik}
  - traefik.http.routers.comam-web.rule=Host(`comam.granlogiamixta.cl`)
  - traefik.http.routers.comam-web.entrypoints=websecure
  - traefik.http.routers.comam-web.tls=true
  - traefik.http.routers.comam-web.tls.certresolver=letsencrypt
  - traefik.http.services.comam-web.loadbalancer.server.port=3000
  - traefik.http.routers.comam-web-http.rule=Host(`comam.granlogiamixta.cl`)
  - traefik.http.routers.comam-web-http.entrypoints=web
  - traefik.http.routers.comam-web-http.middlewares=redirect-to-https@docker
```

Si el proyecto de referencia en producción usa otros nombres (`entrypoints`, `certresolver`, middleware), copiar esos valores en `docker-compose.yml` y `.env`.

## Al clonar un proyecto de referencia

1. Abrir su `docker-compose.yml` y localizar el servicio web con `traefik.enable=true`.
2. Copiar `networks` externas y todas las `labels` de Traefik.
3. Sustituir el host por `comam.granlogiamixta.cl` y el puerto del load balancer por `3000`.
4. No incluir contenedor Traefik ni publicar puertos 80/443 en el stack COMAM.

## MinIO / archivos públicos (fase inicial)

Opción adoptada: **MinIO solo en red interna**; la app sirve descargas vía API con URLs firmadas o rutas `/api/files/*`. `S3_PUBLIC_ENDPOINT` apunta a `APP_URL` para enlaces generados por la aplicación.

## Verificación

```bash
curl -fsS https://comam.granlogiamixta.cl/api/health
docker compose logs -f comam-web
```
