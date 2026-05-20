/**
 * @file main.tsx
 * @description 애플리케이션의 진입점(Entry Point)입니다.
 * React 프로젝트의 루트 요소를 렌더링하며, 전역 스타일을 로드합니다.
 * @lastModified 2026-05-15
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // 글로벌 테마 및 Tailwind CSS 스타일 로드
import App from './App.tsx' // 최상위 루트 컴포넌트 로드

/**
 * HTML의 'root' 요소를 찾아 React 애플리케이션을 마운트합니다.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// EOF: main.tsx
