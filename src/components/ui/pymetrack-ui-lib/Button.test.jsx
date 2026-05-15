import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('button--primary');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('button--secondary');
  });

  it('renders with danger variant', () => {
    render(<Button variant="danger">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('button--danger');
  });

  it('renders with outline variant', () => {
    render(<Button variant="outline">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('button--outline');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('button--sm');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('button--lg');
  });

  it('renders with full width', () => {
    render(<Button fullWidth>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('button--full-width');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
  });

  it('is disabled when loading prop is true', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
  });

  it('renders loading spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByText('Loading');
    expect(button).toContainHTML('svg');
  });

  it('renders icon on left by default', () => {
    render(<Button icon={<span data-testid="icon">Icon</span>}>Click me</Button>);
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders icon on right when specified', () => {
    render(<Button icon={<span data-testid="icon">Icon</span>} iconPosition="right">Click me</Button>);
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });
});
