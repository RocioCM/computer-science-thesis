import { FormHandleChange } from '@/common/hooks/useForm/types';
import Labels from '../Labels';
import Img from '@/common/components/Img';
import cn from '@/common/utils/classNames';
import iconActiveCheck from '@/public/assets/icon-toggle-active-check.svg';
import iconActiveCross from '@/public/assets/icon-toggle-active-cross.svg';
import iconInactiveCheck from '@/public/assets/icon-toggle-inactive-check.svg';
import iconInactiveCross from '@/public/assets/icon-toggle-inactive-cross.svg';
import styles from './InputToggle.module.css';

const ICONS = {
  check: {
    active: iconActiveCheck, // Showed on the handle
    inactive: iconInactiveCheck, // Showed on background
  },
  cross: {
    active: iconActiveCross, // Showed on background
    inactive: iconInactiveCross, // Showed on the handle
  },
};

const CONTAINER_STYLE = 'gap-m items-center';
const BOX_STYLE = 'border border-n2 rounded-rs p-m';
const DISABLED_STYLE = 'opacity-60';

const TOGGLE_BASE_STYLE = 'w-12 h-7 p-0.5 rounded-full';
const UNCHECKED_STYLE = 'bg-n1';
const CHECKED_STYLE = 'bg-p1';
const HANDLE_BASE_STYLE = 'w-6 h-6';
const UNCHECKED_HANDLE_STYLE = 'bg-n0 shadow-e1 left-0';
const CHECKED_HANDLE_STYLE = 'bg-n0 left-5';

const ICON_SIZE_STYLE = 'w-2.5 h-2.5';
const CROSS_ICON_POSITION_STYLE = 'left-2';
const CHECK_ICON_POSITION_STYLE = 'right-2';

export interface Props {
  name: string;
  value?: boolean;
  label?: string; // Right side of the toggle
  description?: string; // Right side of the toggle
  leftLabel?: string; // Left side of the toggle
  leftDescription?: string; // Left side of the toggle
  className?: string;
  isDisabled?: boolean;
  box?: boolean; // Should the toggle + labels have box style.
  handleChange: FormHandleChange;
  showIcons?: boolean;
}

const InputToggle: React.FC<Props> = ({
  name,
  value = false,
  label, // Right side of the toggle
  description, // Right side of the toggle
  leftLabel, // Left side of the toggle
  leftDescription, // Left side of the toggles
  className = '',
  isDisabled = false,
  box = false,
  handleChange,
  showIcons = true, // Set to false to hide icons by default.
}) => {
  const isChecked = !!value;

  const handleToggle = () => {
    handleChange(name, !isChecked); // Toggle the value
  };

  return (
    <label
      className={cn(
        'flex flex-row items-start',
        CONTAINER_STYLE,
        isDisabled ? DISABLED_STYLE : 'cursor-pointer',
        box ? BOX_STYLE : '',
        className
      )}
    >
      <Labels label={leftLabel} description={leftDescription} />
      <input
        type="checkbox"
        hidden
        name={name}
        value="toggle"
        checked={isChecked}
        disabled={isDisabled}
        className={className}
        onChange={handleToggle}
      />
      <span
        className={cn(
          styles.toggle,
          'relative shrink-0 flex items-center transition-[box-shadow,background-color] duration-300',
          TOGGLE_BASE_STYLE,
          isChecked ? CHECKED_STYLE : UNCHECKED_STYLE
        )}
      >
        <span
          className={cn(
            'block rounded-full relative transition-[box-shadow,left] duration-300',
            HANDLE_BASE_STYLE,
            isChecked ? CHECKED_HANDLE_STYLE : UNCHECKED_HANDLE_STYLE
          )}
        ></span>
        {showIcons && (
          <>
            <Img
              src={ICONS.cross[isChecked ? 'active' : 'inactive']}
              alt="icon"
              className={cn(
                'object-contain absolute z-[1]',
                ICON_SIZE_STYLE,
                CROSS_ICON_POSITION_STYLE
              )}
            />
            <Img
              src={ICONS.check[isChecked ? 'active' : 'inactive']}
              alt="icon"
              className={cn(
                'object-contain absolute z-[1]',
                ICON_SIZE_STYLE,
                CHECK_ICON_POSITION_STYLE
              )}
            />
          </>
        )}
      </span>
      <Labels label={label} description={description} />
    </label>
  );
};

export default InputToggle;
