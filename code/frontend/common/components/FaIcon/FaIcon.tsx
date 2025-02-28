import cn from '@/common/utils/classNames';
import React from 'react';

export const FA = {
  solid: 'fa-solid',
  regular: 'fa-regular',
};

interface Props {
  type?: string;
  value?: {
    type: string;
    color?: string;
  };
  className?: string;
}

const FaIcon: React.FC<Props> = ({
  type = '',
  value = null,
  className = '',
  ...props
}) => {
  return (
    <i
      {...props}
      className={cn(type, value?.type, className)}
      style={{ color: value?.color }}
    ></i>
  );
};

export default FaIcon;
