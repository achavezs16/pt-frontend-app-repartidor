import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()}>Content</Modal>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Modal Title">Content</Modal>);
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<Modal isOpen={true} onClose={handleClose}>Content</Modal>);
    const closeButton = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(<Modal isOpen={true} onClose={handleClose}>Content</Modal>);
    const overlay = screen.getByText('Content').closest('.modal-overlay');
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when backdrop is clicked and closeOnBackdropClick is false', () => {
    const handleClose = vi.fn();
    render(<Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={false}>Content</Modal>);
    const overlay = screen.getByText('Content').closest('.modal-overlay');
    fireEvent.click(overlay);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders with small size', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} size="sm">Content</Modal>);
    const modal = screen.getByText('Content').closest('.modal');
    expect(modal).toHaveClass('modal--sm');
  });

  it('renders with large size', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} size="lg">Content</Modal>);
    const modal = screen.getByText('Content').closest('.modal');
    expect(modal).toHaveClass('modal--lg');
  });

  it('does not render close button when showCloseButton is false', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>Content</Modal>);
    expect(screen.queryByLabelText('Cerrar modal')).not.toBeInTheDocument();
  });

  it('has correct role and aria attributes', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Modal Title">Content</Modal>);
    const overlay = screen.getByText('Content').closest('.modal-overlay');
    expect(overlay).toHaveAttribute('role', 'dialog');
    expect(overlay).toHaveAttribute('aria-modal', 'true');
    expect(overlay).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});
