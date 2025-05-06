import { render, screen, fireEvent, act } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title and optional subtitle', () => {
    render(
      <div id="modal-root">
        <ConfirmationModal title="Confirm?" handleCancel={() => {}} />
      </div>
    );
    expect(screen.getByText('Confirm?')).toBeInTheDocument();
  });

  it('calls handleConfirm when confirm button is clicked', async () => {
    const onConfirm = jest.fn();
    render(
      <div id="modal-root">
        <ConfirmationModal
          title="Confirm?"
          confirmLabel="Aceptar"
          handleConfirm={onConfirm}
          handleCancel={() => {}}
        />
      </div>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Aceptar'));
    });
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls handleCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn();
    render(
      <div id="modal-root">
        <ConfirmationModal title="Confirm?" handleCancel={onCancel} />
      </div>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Cancelar'));
    });
    expect(onCancel).toHaveBeenCalled();
  });

  it('should not crash if handleCancel is not provided and cancel button is clicked', async () => {
    const props: any = {}; // Bypass required props
    render(
      <div id="modal-root">
        <ConfirmationModal title="Confirm?" {...props} />
      </div>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Cancelar'));
      fireEvent.click(screen.getByText('Aceptar'));
    });
    expect(screen.getByText('Confirm?')).toBeInTheDocument();
  });

  it('disables confirm button when disableConfirm is true', () => {
    render(
      <div id="modal-root">
        <ConfirmationModal
          title="Confirm?"
          confirmLabel="Confirmar"
          disableConfirm
          handleCancel={() => {}}
        />
      </div>
    );
    const buttons = screen.getAllByRole('button');
    const confirmButton = buttons.find(
      (button) => button.textContent === 'Confirmar'
    );
    expect(confirmButton).toBeDisabled();
  });

  it('hides cancel button when hideCancel is true', () => {
    render(
      <div id="modal-root">
        <ConfirmationModal
          title="Confirm?"
          hideCancel
          handleCancel={() => {}}
        />
      </div>
    );
    expect(screen.queryByText('Cancelar')).toBeNull();
  });

  it('hides both buttons when hideButtons is true', () => {
    render(
      <div id="modal-root">
        <ConfirmationModal
          title="Confirm?"
          hideButtons
          handleCancel={() => {}}
        />
      </div>
    );
    expect(screen.queryByText('Aceptar')).toBeNull();
    expect(screen.queryByText('Cancelar')).toBeNull();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('renders children when provided', () => {
    render(
      <div id="modal-root">
        <ConfirmationModal title="Confirm?" handleCancel={() => {}}>
          <div data-testid="custom-child">Extra Info</div>
        </ConfirmationModal>
      </div>
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});
