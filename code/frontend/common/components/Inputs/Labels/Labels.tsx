import cn from '@/common/utils/classNames';

const TITLE_STYLE = 'p text-n10';
const DESCRIPTION_STYLE = 's text-n3';

interface Props {
  label?: string;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

const Labels: React.FC<Props> = ({
  label = '',
  description = '',
  containerClassName = '',
  labelClassName = '',
  descriptionClassName = '',
}) => {
  if (!label && !description) return null;

  return (
    <span className={cn('flex flex-col gap-0', containerClassName)}>
      {label && (
        <span className={cn(TITLE_STYLE, labelClassName)}>{label}</span>
      )}
      {description && (
        <span className={cn(DESCRIPTION_STYLE, descriptionClassName)}>
          {description}
        </span>
      )}
    </span>
  );
};

export default Labels;
