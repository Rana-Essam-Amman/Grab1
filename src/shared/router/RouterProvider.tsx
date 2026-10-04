import React from 'react';
import { BrowserRouter } from 'react-router-dom';

interface RouterProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Single entry point for react-router-dom at the app root.
 *
 * Only src/shared/router/** may import react-router-dom (enforced by 
 * eslint-config). Any other module must either use useUI().navigateTo() 
 * or consume RouterProvider/useUrlSync from this folder.
 */
export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);
