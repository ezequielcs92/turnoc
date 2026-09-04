"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main id="contenido" className="admin-login"><section className="admin-login-card"><span className="eyebrow">Algo salió de escena</span><h1 className="display section-title">No pudimos cargar esta página.</h1><p className="lede">Podés intentar nuevamente sin perder el resto del recorrido.</p><button className="button button-primary" type="button" onClick={reset}>Reintentar</button></section></main>; }
