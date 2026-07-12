import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEOHead from '@/components/seo/SEOHead';

const renderWithProviders = (ui) => render(
  <HelmetProvider>
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  </HelmetProvider>
);

describe('SEOHead', () => {
  it('sets the page title', () => {
    renderWithProviders(<SEOHead title="Canciones" description="Test" />);
    expect(document.title).toBe('Canciones | Cabaxx');
  });

  it('renders meta description', () => {
    renderWithProviders(<SEOHead title="Test" description="Mi descripción" />);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).toBeTruthy();
    expect(meta.getAttribute('content')).toBe('Mi descripción');
  });

  it('renders canonical link', () => {
    renderWithProviders(<SEOHead title="Test" url="https://cabaxx.com/canciones" />);
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toBeTruthy();
    expect(canonical.getAttribute('href')).toBe('https://cabaxx.com/canciones');
  });
});
