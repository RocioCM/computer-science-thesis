import cn from '@/common/utils/classNames';

const CARD_BASE_STYLES = 'bg-n0 border border-n2 gap-s';

const SHADOW_STYLES = {
  none: '',
  e1: 'shadow-e1',
  e2: 'shadow-e2',
  e3: 'shadow-e3',
  e4: 'shadow-e4',
};

const ROUNDED_STYLES = {
  s: 'rounded-rs',
  m: 'rounded-rm',
  l: 'rounded-rl',
};

const PADDING_X_STYLES = {
  none: 'px-0',
  xs: 'px-xs',
  s: 'px-s',
  m: 'px-m',
  l: 'px-l',
  xl: 'px-xl',
  '2xl': 'px-2xl',
  '3xl': 'px-3xl',
};

const PADDING_Y_STYLES = {
  none: 'py-0',
  xs: 'py-xs',
  s: 'py-s',
  m: 'py-m',
  l: 'py-l',
  xl: 'py-xl',
  '2xl': 'py-2xl',
  '3xl': 'py-3xl',
};

interface Props {
  children?: React.ReactNode;
  className?: string;
  shadow?: keyof typeof SHADOW_STYLES;
  rounded?: keyof typeof ROUNDED_STYLES;
  padding?: keyof typeof PADDING_X_STYLES;
  paddingX?: keyof typeof PADDING_X_STYLES | '';
  paddingY?: keyof typeof PADDING_Y_STYLES | '';
}

const Card: React.FC<Props> = ({
  children,
  className = '',
  shadow = 'none',
  rounded = 's',
  padding = 'm',
  paddingX = '',
  paddingY = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col h-max w-full', // Base
        CARD_BASE_STYLES,
        PADDING_X_STYLES[paddingX || padding],
        PADDING_Y_STYLES[paddingY || padding],
        ROUNDED_STYLES[rounded],
        SHADOW_STYLES[shadow],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
