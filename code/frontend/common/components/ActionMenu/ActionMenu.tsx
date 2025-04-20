import useToggle from '@/common/hooks/useToggle';
import cn from '@/common/utils/classNames';
import FaIcon from '../FaIcon';

const POSITION_STYLES = {
  relative: 'relative',
  topLeftCorner: 'absolute top-0 left-0',
  topRightCorner: 'absolute top-0 right-0',
};

const EMERGE_FROM_STYLES = {
  topLeft: 'top-6 left-4',
  topRight: 'top-6 right-4',
};

export interface Props {
  itemId?: number;
  emergeFrom: 'topLeft' | 'topRight';
  actions: {
    label: string;
    icon?: string;
    callback: (itemId: number) => void;
  }[];
  position?: 'relative' | 'topLeftCorner' | 'topRightCorner';
  className?: string;
  actionClassName?: string;
  actionIcon?: string;
}

const ActionMenu: React.FC<Props> = ({
  emergeFrom,
  actions = [],
  itemId,
  position = 'relative',
  className,
  actionClassName,
}) => {
  const [showMenu, toggleMenu, , hideMenu] = useToggle(false);

  return (
    <div
      data-testid="action-menu"
      className={cn(POSITION_STYLES[position], 'p-1', className)}
      tabIndex={0}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && hideMenu()}
      onClick={(e) => {
        e.preventDefault();
        toggleMenu();
      }}
    >
      <FaIcon
        type="fa-solid fa-ellipsis"
        className="cursor-pointer text-base"
      />

      <div
        data-testid="action-menu-popup"
        className={cn(
          'absolute bg-n0 shadow-e1 rounded-md overflow-y-auto transition-[max-height,width]',
          showMenu ? 'max-h-[10rem] w-[11.5rem] h-max' : 'max-h-0 w-0',
          EMERGE_FROM_STYLES[emergeFrom],
          'z-10'
        )}
        tabIndex={0}
      >
        {actions.map((action, i) => (
          <div
            key={i}
            className={cn(
              'flex p-2 border-n2 items-center justify-between cursor-pointer',
              i > 0 ? 'border-t' : '',
              actionClassName
            )}
            onClick={(e) => {
              e.preventDefault();
              hideMenu();
              action.callback(itemId || 0);
            }}
          >
            <span>{action.label}</span>
            {action.icon && (
              <FaIcon type={action.icon} className="text-base mr-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionMenu;
