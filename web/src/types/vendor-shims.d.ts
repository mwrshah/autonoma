declare module "highlight.js/lib/core" {
  const hljs: any;
  export default hljs;
}

declare module "highlight.js/lib/languages/*" {
  const language: any;
  export default language;
}

declare module "marked" {
  export const marked: any;
}

declare module "lucide/dist/esm/createElement.js" {
  const createElement: any;
  export default createElement;
}

declare module "lucide/dist/esm/icons/*.js" {
  const icon: any;
  export default icon;
}
