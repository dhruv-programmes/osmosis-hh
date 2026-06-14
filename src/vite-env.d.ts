/// <reference types="vite/client" />
/// <reference path="./types/three-extensions.d.ts" />

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

export {};
