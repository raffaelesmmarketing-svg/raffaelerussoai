import type { NextConfig } from "next";
import { linkCorti } from "./src/lib/guide";

const nextConfig: NextConfig = {
  // Le offerte vecchie (consulenza a 199 €, formazione, sponsorizzazioni) sono spente per ora:
  // chi arriva dai link vecchi finisce sulla consulenza gratuita. Temporaneo (307), non permanente,
  // così se un'offerta torna i browser non hanno in memoria il rimando.
  async redirects() {
    return [
      { source: "/consulenza", destination: "/chiamata-gratuita", permanent: false },
      { source: "/lavoriamo-insieme", destination: "/chiamata-gratuita", permanent: false },
      // I link corti dei messaggi in privato del Centralino (raffaelerussoai.com/g/instagram): temporanei, così
      // una parola può cambiare guida. Una parola che non c'è (o non c'è più) porta a tutte le guide.
      ...linkCorti().map(({ parola, destinazione }) => ({ source: `/g/${parola}`, destination: destinazione, permanent: false })),
      { source: "/g/:resto*", destination: "/risorse?da=instagram", permanent: false },
    ];
  },
};

export default nextConfig;
