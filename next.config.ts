import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le offerte vecchie (consulenza a 199 €, formazione, sponsorizzazioni) sono spente per ora:
  // chi arriva dai link vecchi finisce sulla consulenza gratuita. Temporaneo (307), non permanente,
  // così se un'offerta torna i browser non hanno in memoria il rimando.
  async redirects() {
    return [
      { source: "/consulenza", destination: "/chiamata-gratuita", permanent: false },
      { source: "/lavoriamo-insieme", destination: "/chiamata-gratuita", permanent: false },
    ];
  },
};

export default nextConfig;
