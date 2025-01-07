import cn from '@/common/utils/classNames';

interface Props {
  size?: string;
  className?: string;
  color?: string;
  lineWidth?: string;
}

const BASE_STYLE = 'border-p1 border-4 w-8 h-8';

const LoadingSpinner: React.FC<Props> = ({
  color = '',
  lineWidth = '',
  size = '',
  className = '',
}) => {
  return (
    <span
      className={cn(
        'block shrink-0 !border-t-transparent animate-spin rounded-full ', // Base
        BASE_STYLE, // Fallback
        className
      )}
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderWidth: lineWidth,
      }}
    ></span>
  );
};

export default LoadingSpinner;
