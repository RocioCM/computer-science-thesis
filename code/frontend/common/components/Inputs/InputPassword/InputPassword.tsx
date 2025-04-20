import Input, { InputProps } from '../Input';
import Img from '@/common/components/Img';
import useToggle from '@/common/hooks/useToggle';
import cn from '@/common/utils/classNames';
import iconShowPassword from '@/public/assets/icon-password-show.svg';
import iconHidePassword from '@/public/assets/icon-password-hide.svg';

interface Props extends InputProps {}

const InputPassword: React.FC<Props> = ({ inputClassName, ...props }) => {
  const [showPassword, toggleShowPassword] = useToggle(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      inputClassName={cn('pr-10', inputClassName)}
      childrenEnd={
        <Img
          src={showPassword ? iconHidePassword : iconShowPassword}
          role="button"
          className="w-l h-l cursor-pointer mr-s"
          onClick={toggleShowPassword}
          alt={showPassword ? 'Hide password' : 'Show password'}
        />
      }
    />
  );
};

export default InputPassword;
