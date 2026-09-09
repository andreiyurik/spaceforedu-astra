# Medición: qué hay que configurar en GTM

Este documento describe **el contrato entre el sitio y Google Tag Manager**. Si
alguien renombra un `data-cta` o un evento, hay que actualizarlo aquí, porque el
contenedor de GTM se configura leyendo esto.

Generado a partir del `dist/` construido, no de memoria.

---

## Antes de nada: dos cosas que hay que hacer una vez

1. **Crear el contenedor** en Google Tag Manager y añadir su ID como secreto de
   GitHub llamado `PUBLIC_GTM_ID`. El código de `GtmHead.astro` ya está puesto y
   no renderiza nada mientras esa variable esté vacía — que es exactamente por
   lo que el sitio llevaba meses sin medir nada.

2. **Comprobar que llega.** Tras el despliegue, `curl -s https://spaceforedu.com/es/ | grep -c gtm.js`
   debe devolver 1. Si devuelve 0, el secreto no está llegando al build.

El consentimiento ya está implementado con Consent Mode v2: el banner escribe
`sfe-consent-v1` en localStorage y emite un evento `sfe:consent`. **Las etiquetas
de analítica deben dispararse solo con consentimiento**, no en todas las páginas.

---

## Eventos que el sitio empuja al dataLayer

Estos ya existen en el código. Solo hay que crear el disparador correspondiente.

| Evento | Cuándo se dispara | Variables que trae |
|---|---|---|
| `sfe_purchase_confirmed` | Al llegar a una página de gracias tras pagar | `sfe_producto`, `sfe_referencia` |
| `sfe_calendario_abierto` | Al pulsar para cargar la agenda de Google | — |

**`sfe_purchase_confirmed` está deduplicado por `sessionStorage`**: recargar la
página de gracias o volver atrás no cuenta la venta dos veces. `sfe_referencia`
es el `session_id` de Stripe, así que sirve para cruzar con el pago real.

Ese es el evento de conversión. Es el único punto medible limpio que puede tener
un sitio estático, y por eso las páginas de gracias existen.

---

## Atributos `data-cta`

Un solo disparador de GTM los cubre todos: **clic en cualquier elemento que
coincida con `[data-cta]`**, y se guarda el valor del atributo en una variable de
elemento del DOM. No hace falta un disparador por botón.

### Los que llevan al dinero

| `data-cta` | Dónde | Qué significa un clic |
|---|---|---|
| `bachillerato-pagar` | Producto 500 €, hero | Intención de compra directa |
| `bachillerato-pagar-ruta` | Producto 500 €, tarjeta de ruta A | Ídem, tras leer las opciones |
| `bachillerato-pagar-final` | Producto 500 €, cierre | Ídem, tras leer la página entera |
| `stripe-buy-button` | Botón incrustado de Stripe | Checkout abierto en la página |
| `consulta-pagar` | Consulta 100 € | Intención de compra de consulta |
| `guia-a-producto` | Las 24 guías de país | **El de mayor intención del sitio** |
| `guia-a-consulta` | Las 24 guías de país | Duda antes de comprar |
| `homologacion-a-producto` | Página de servicio → producto | El paso de informarse a comprar |

**Cuando falta el Payment Link o el Buy Button**, los tres primeros aparecen como
`bachillerato-pagar-fallback`, `bachillerato-pagar-fallback-ruta` y
`bachillerato-pagar-fallback-final`, y `consulta-pagar` como
`consulta-pagar-fallback`. Eso permite saber **cuánta gente
pulsó antes de que el cobro existiera**, que es un dato y no un fallo.

### Contacto

| `data-cta` | Dónde |
|---|---|
| `whatsapp` | Componente genérico de WhatsApp |
| `whatsapp-blog` | Cierre de los artículos del blog |
| `sticky-whatsapp-movil` · `sticky-whatsapp-escritorio` | Barra fija |
| `sticky-tel` | Llamada desde la barra fija, solo móvil |
| `footer-social-whatsapp` | Pie, junto al resto de redes |
| `thankyou-whatsapp` · `thankyou-email` | Página de gracias |
| `thankyou-home` | Volver a la portada desde la página de gracias |

`footer-social-*` se genera con el nombre de cada red, así que aparecerán
`footer-social-linkedin`, `-telegram`, etc. **en cuanto se configuren esas
variables**. Hoy solo existe el de WhatsApp porque es la única definida.

Lo mismo con `thankyou-email`: existe en el código pero **solo se renderiza si
`PUBLIC_CONTACT_EMAIL` está puesta**. En un build sin esa variable no aparece.

### Consulta y navegación

| `data-cta` | Dónde |
|---|---|
| `hero-consulta` · `final-consulta` · `precios-consulta` | Diálogo de consulta |
| `sticky-consulta` | Barra fija |
| `bachillerato-ir-consulta` · `bachillerato-ruta-consulta` | Producto → consulta |
| `consulta-ver-precios` · `pricing-plan` | Precios |
| `guia-pais` | Índice de guías → una guía |
| `bachillerato-volante` | Producto → artículo del volante |
| `404-destino` | Los seis destinos del 404 |
| `calendario-cargar` | Cargar la agenda |

**`404-destino` merece un informe propio.** Dice qué buscaba la gente que llegó a
una página que no existe, y eso informa sobre enlaces rotos externos apuntando al
dominio mejor que cualquier auditoría hecha desde dentro.

---

## Las tres conversiones que conviene definir en GA4

1. **`sfe_purchase_confirmed`** — la venta. La única que cuenta dinero.
2. **Clic en `guia-a-producto` o `guia-a-consulta`** — el paso de contenido a
   producto. Si el tráfico de guías no convierte, el problema está en la guía;
   si convierte y luego no paga, está en la página de producto.
3. **Clic en cualquier `data-cta` que empiece por `whatsapp` o `sticky-`** — el
   contacto por canal no medible. Sabiendo cuántos son, se puede estimar cuánta
   conversión ocurre fuera de la web.

---

## Cómo comprobar que esto sigue siendo cierto

```
npm run build
grep -rhoE 'data-cta="[^"]+"' dist | sort | uniq -c | sort -rn
```

Si aparece un `data-cta` que no está en este documento, alguien añadió un CTA sin
documentarlo y GTM no lo estará midiendo.
