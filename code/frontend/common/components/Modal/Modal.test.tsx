import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content correctly', () => {
    render(
      <div id="modal-root">
        <Modal handleCancel={() => {}}>
          <div>Modal Content</div>
        </Modal>
      </div>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('closes when clicking outside if skippable is true', () => {
    const handleCancel = jest.fn();
    render(
      <div id="modal-root">
        <Modal handleCancel={handleCancel} skippable>
          <div data-testid="modal-content">Modal Content</div>
        </Modal>
      </div>
    );
    fireEvent.click(screen.getByTestId('modal')); // Modal background
    expect(handleCancel).toHaveBeenCalled();
  });

  it('does not close when clicking outside if skippable is false', () => {
    const handleCancel = jest.fn();
    render(
      <div id="modal-root">
        <Modal handleCancel={handleCancel} skippable={false}>
          <div data-testid="modal-content">Modal Content</div>
        </Modal>
      </div>
    );
    fireEvent.click(screen.getByTestId('modal'));
    expect(handleCancel).not.toHaveBeenCalled();
  });

  it('calls handleCancel when clicking the close button', () => {
    const handleCancel = jest.fn();
    render(
      <div id="modal-root">
        <Modal handleCancel={handleCancel} />
      </div>
    );
    const closeButton = screen.getByAltText('Cerrar');
    fireEvent.click(closeButton);
    expect(handleCancel).toHaveBeenCalled();
  });

  it('hides close button when hideCloseButton is true', () => {
    render(
      <div id="modal-root">
        <Modal handleCancel={() => {}} hideCloseButton />
      </div>
    );
    expect(screen.queryByAltText('Cerrar')).toBeNull();
  });

  it('renders big size when big is true', () => {
    render(
      <div id="modal-root">
        <Modal handleCancel={() => {}} big />
      </div>
    );
    expect(screen.getByTestId('modal').firstChild).toHaveClass(
      'w-[700px] h-[700px]'
    );
  });
});
