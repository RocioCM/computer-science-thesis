import FaIcon from '@/common/components/FaIcon';
import cn from '@/common/utils/classNames';

interface Props {
  size?: string;
  className?: string;
  color?: string;
  lineWidth?: string;
}

const BASE_STYLE = 'w-8 text-[2rem]';

const LoadingSpinner: React.FC<Props> = ({
  color = '',
  size = '',
  className = '',
}) => {
  return (
    <span
      data-testid="loading-spinner"
      className={cn(
        'block shrink-0 animate-spin', // Base
        BASE_STYLE, // Fallback
        className
      )}
      style={{
        width: size,
        fontSize: size,
        color: color,
      }}
    >
      <FaIcon type="fa-solid fa-recycle" />
    </span>
  );
};

export default LoadingSpinner;
