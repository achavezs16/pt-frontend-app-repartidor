import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card, { CardHeader, CardBody, CardFooter } from './Card';

describe('Card', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(<Card subtitle="Card Subtitle">Content</Card>);
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('renders with image', () => {
    render(<Card image="/test.jpg">Content</Card>);
    const image = screen.getByAltText('Card image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test.jpg');
  });

  it('renders with elevated variant', () => {
    render(<Card variant="elevated">Content</Card>);
    const card = screen.getByText('Content').closest('.card');
    expect(card).toHaveClass('card--elevated');
  });

  it('renders with hoverable variant', () => {
    render(<Card hoverable>Content</Card>);
    const card = screen.getByText('Content').closest('.card');
    expect(card).toHaveClass('card--hoverable');
  });

  it('renders with actions', () => {
    render(<Card actions={<button>Action</button>}>Content</Card>);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders CardHeader component', () => {
    render(<CardHeader title="Header Title" subtitle="Header Subtitle" />);
    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByText('Header Subtitle')).toBeInTheDocument();
  });

  it('renders CardBody component', () => {
    render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders CardFooter component', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
