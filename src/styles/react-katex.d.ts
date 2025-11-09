// src/types/react-katex.d.ts
declare module 'react-katex' {
    import { FC } from 'react';
  
    export const InlineMath: FC<{ children: string }>;
    export const BlockMath: FC<{ children: string }>;
  }
  