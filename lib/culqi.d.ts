// lib/culqi.d.ts
export {};

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void; // La función que Culqi llama cuando termina
  }
}