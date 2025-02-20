import cn from '@/common/utils/classNames';
import Img from '../Img';
import iconAdd from '@/public/assets/icon-add-white.svg';

interface Props {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
}

const ButtonAdd: React.FC<Props> = ({
  onClick,
  className,
  disabled,
  title,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-10 w-14 h-14 rounded-full bg-p1 flex items-center justify-center disabled:bg-n3',
        className
      )}
      disabled={disabled}
      title={title}
    >
      <Img src={iconAdd} alt="Add" className="w-[80%] h-[80%] object-contain" />
    </button>
  );
};

export default ButtonAdd;
