# Cómo mergear y desplegar esta tanda

Estado verificado el 9 de septiembre de 2026.

---

## 1. El merge

Los PR del #6 al #31 forman **una cadena**: cada uno tiene como base el
anterior. **No hay que mergearlos uno a uno.**

```
#6 → #7 → #8 → #9 → #12 → #10 → #11 → #13 → #14 → #15 → #16
   → #17 → #18 → #19 → #20 → #21 → #22 → #23 → #24 → #25
   → #26 → #27 → #28 → #29 → #30 → #31
```

**Mergear el #31 los arrastra todos.** Verificado:

- Los 26 en `MERGEABLE`.
- La punta contiene `main`: la pila está al día, `main` no se ha movido.
- Simulación de merge sobre `main`: **limpio, sin conflictos**.
- 29 commits en total.

Si prefieres revisarlos por separado, mergéalos **en el orden de arriba**. Saltarse
uno hace que el siguiente arrastre cambios que aún no has revisado.

---

## 2. Lo que hay que configurar ANTES de mergear

Porque el despliegue se dispara solo al tocar `main`.

### Secretos de GitHub imprescindibles

| Secreto | Sin él |
|---|---|
| `PUBLIC_GTM_ID` | El sitio se despliega **sin ninguna medición**. Es el fallo que llevaba meses activo |
| `PUBLIC_CONTACT_WHATSAPP` | **El build FALLA a propósito** si sigue el valor de ejemplo |

### Opcionales, con degradación controlada

| Secreto | Sin él |
|---|---|
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` + `PUBLIC_STRIPE_BUY_BUTTON_500` / `_100` | Los botones caen al Payment Link |
| `PUBLIC_STRIPE_LINK_BACHILLERATO_500` / `_CONSULTA_100` | Y de ahí, a la página de precios |
| `PUBLIC_CALENDAR_BOOKING_URL` | El bloque de agenda no se renderiza |
| `PUBLIC_SOCIAL_*` | Los botones de compartir y el `sameAs` del schema quedan vacíos |

Ninguno rompe nada al faltar. Comprobado con y sin cada uno.

**Al crear los Payment Links**, el `success_url` tiene que llevar el `session_id`:

```
https://spaceforedu.com/es/gracias-homologacion/?session_id={CHECKOUT_SESSION_ID}
https://spaceforedu.com/es/gracias-consulta/?session_id={CHECKOUT_SESSION_ID}
```

Sin eso, la página de gracias no puede cruzar el pago con el lead y el evento de
conversión llega sin referencia.

---

## 3. Después del despliegue: seis comprobaciones

Se hacen en dos minutos y detectan lo que un build en verde no garantiza.

```bash
# 1. GTM llega de verdad. Debe devolver 1, no 0.
curl -s https://spaceforedu.com/es/ | grep -c gtm.js

# 2. Las cabeceras del .htaccess se aplican (LiteSpeed puede no traer mod_headers).
curl -sI https://spaceforedu.com/es/ | grep -iE "strict-transport|x-frame|cache-control"

# 3. Las URLs del WordPress antiguo redirigen en vez de dar 404.
curl -sI https://spaceforedu.com/space-omission/ | head -1     # 301
curl -sI https://spaceforedu.com/es/blog/guia-homologacion-titulo-espana-2025/ | head -1   # 301

# 4. www redirige al dominio sin www.
curl -sI https://www.spaceforedu.com/ | head -1                # 301

# 5. El sitemap tiene las páginas nuevas.
curl -s https://spaceforedu.com/sitemap-0.xml | grep -c "guias/"   # 27

# 6. El WAF ya no bloquea a Googlebot.
curl -sI -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://spaceforedu.com/es/ | head -1
```

**La sexta es la que decide si todo lo demás sirve de algo.** Mientras `hcdn`
devuelva 403 con `noindex` a Googlebot, nada de esto se indexa.

---

## 4. Lo que solo se puede confirmar en producción

De la checklist de veinte puntos, tres no se pueden verificar antes:

- **Analítica (9)** — que GTM dispare de verdad, con el contenedor creado.
- **Consentimiento (15)** — que el banner bloquee y desbloquee las etiquetas.
- **Formularios (18)** — el checkout de Stripe, con un pago real de prueba.

Los otros diecisiete están comprobados y quedan protegidos por
`npm run auditoria`, `npm run env:check` y los dos guardarraíles de i18n que
corren dentro del build.

---

## 5. Nota sobre el tiempo de build

Medido el 9-IX-2026 en un portátil:

| | |
|---|---|
| **Sin caché de Astro — lo que hace CI** tras `npm ci` | **234 s y 218 s** |
| Con `node_modules/.astro` caliente | ~50 s |

**El número de arriba es el que cuenta**, y está confirmado por dos mediciones
independientes y consistentes: CI siempre parte sin caché porque `npm ci` borra
`node_modules`, y ahí vive la caché.

El grueso es generar 36 imágenes OG con satori y resvg: trabajo de CPU que escala
con el número de páginas, y el sitio pasó de 59 a 95 en esta tanda.

**Sobre el número "en caliente", una advertencia honesta.** Solo tengo una lectura
limpia (~50 s). Otros dos intentos dieron 283 s y 1635 s, y ninguno vale: el
primero venía de cambiar de rama —lo que invalida la caché de OG— y el segundo
corría en segundo plano compitiendo por CPU con otro build. Los dejo anotados en
vez de borrarlos porque explican por qué no conviene fiarse de una sola medición
de tiempo hecha con la máquina ocupada.

Para la decisión da igual: lo que importa es el build en frío, y ese es sólido.

Por eso `timeout-minutes` sube de 10 a 25. No es para ocultar un build lento: si
algún día tarda 20 minutos, hay que mirarlo. Es para que un despliegue correcto
no muera por el reloj.
