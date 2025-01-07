import cn from '@/common/utils/classNames';

interface Props {
  errorMessage?: string;
  className?: string;
}

/** Just an error message with it's standard style. Enjoy it. */
const ErrorMessage: React.FC<Props> = ({ errorMessage, className }) => {
  return errorMessage ? (
    <p className={cn('s text-fe1 mt-xs', className)}>{errorMessage}</p>
  ) : null;
};

export default ErrorMessage;
