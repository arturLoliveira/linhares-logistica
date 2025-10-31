// Define o módulo para o TypeScript
declare module '*.svg?react' {
  import React from 'react';

  // Define o tipo do componente como um Componente Funcional do React
  // que aceita todas as propriedades de um <svg> (incluindo 'className')
  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  
  export default Component;
}