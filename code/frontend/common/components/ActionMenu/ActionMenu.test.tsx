import { render, screen, fireEvent, act } from '@testing-library/react';
import ActionMenu, { Props } from './ActionMenu';

const actions: Props['actions'] = [
  { label: 'Action 1', callback: jest.fn() },
  { label: 'Action 2', callback: jest.fn(), icon: 'fa-solid fa-check' },
];

describe('ActionMenu Component', () => {
  it('renders correctly', () => {
    render(<ActionMenu emergeFrom="topLeft" actions={actions} />);
    expect(screen.getByText('Action 1')).toBeInTheDocument();
  });

  it('toggles menu visibility on click', async () => {
    render(<ActionMenu emergeFrom="topLeft" actions={actions} />);
    const trigger = screen.getByTestId('action-menu');
    const popup = screen.getByTestId('action-menu-popup');
    await act(async () => {
      fireEvent.click(trigger);
    });
    expect(popup).toHaveClass('max-h-[10rem] w-[11.5rem] h-max');

    await act(async () => {
      fireEvent.click(trigger);
    });
    expect(popup).toHaveClass('max-h-0 w-0');
  });

  it('calls action callback on action click', () => {
    render(<ActionMenu emergeFrom="topLeft" actions={actions} itemId={1} />);
    fireEvent.click(screen.getByTestId('action-menu'));
    fireEvent.click(screen.getByText('Action 1'));
    expect(actions[0].callback).toHaveBeenCalledWith(1);
  });

  it('renders with custom className', () => {
    render(
      <ActionMenu
        emergeFrom="topLeft"
        actions={actions}
        className="custom-class"
      />
    );
    expect(screen.getByTestId('action-menu')).toHaveClass('custom-class');
  });

  it('renders action with icon', () => {
    render(<ActionMenu emergeFrom="topLeft" actions={actions} />);
    fireEvent.click(screen.getByTestId('action-menu'));
    expect(screen.getByText('Action 2')).toBeInTheDocument();
    expect(screen.getByText('Action 2').parentElement?.childElementCount).toBe(
      2
    );
  });

  it('hides menu on blur', async () => {
    render(<ActionMenu emergeFrom="topLeft" actions={actions} />);
    const trigger = screen.getByTestId('action-menu');
    await act(async () => {
      fireEvent.click(trigger);
      fireEvent.blur(trigger);
    });
    const popup = screen.getByTestId('action-menu-popup');
    expect(popup).toHaveClass('max-h-0 w-0');
  });
});
