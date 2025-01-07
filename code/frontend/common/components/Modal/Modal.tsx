import React from 'react';
import reactDOM from 'react-dom';
import Img from '@/common/components/Img';
import useFirstRender from '@/common/hooks/useFirstRender';
import cn from '@/common/utils/classNames';
import iconClose from '@/public/assets/icon-close.svg';

const BG_STYLE = 'bg-n10 bg-opacity-70 py-2xl px-xl';

const MODAL_STYLE = 'bg-n0 min-w-[300px] min-h-[200px]';

const MODAL_SIZES_STYLE = {
  big: 'w-[1220px] h-[700px] max-h-full max-w-full px-xl py-xl',
  normal: 'w-[380px] h-max max-h-full max-w-full px-3xl py-3xl',
};

export interface Props {
  children?: React.ReactNode | React.JSX.Element[];
  handleCancel: () => any;
  hideCloseButton?: boolean;
  big?: boolean;
  skippable?: boolean;
  className?: string;
  contentClassName?: string;
}

const Modal = ({
  children,
  handleCancel,
  hideCloseButton = false,
  big = false,
  skippable = true,
  className,
  contentClassName,
}: Props) => {
  const isFirstRender = useFirstRender();

  const handleBlurClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && skippable) handleCancel();
  };

  const ModalContent = (
    <div
      className={cn(
        BG_STYLE, // Background
        'w-full h-screen fixed top-0 left-0 z-modal flex justify-center items-center', // Base
        'animate__animated animate__fadeIn', // Animation
        skippable ? 'cursor-pointer' : '', // Skippable
        className // Custom classes
      )}
      onClick={handleBlurClose}
    >
      <div
        className={cn(
          MODAL_STYLE,
          'rounded-rm overflow-y-auto flex flex-col items-center relative cursor-default', // Base
          'animate__animated animate__zoomIn', // Animation
          big ? MODAL_SIZES_STYLE.big : MODAL_SIZES_STYLE.normal, // Size
          contentClassName // Custom classes
        )}
      >
        {!hideCloseButton && (
          <div className="flex justify-end w-full h-0 sticky top-0">
            <Img
              src={iconClose}
              width={30}
              height={30}
              alt="Cerrar"
              onClick={handleCancel}
              className="h-5 w-auto cursor-pointer object-contain"
            />
          </div>
        )}
        {children}
      </div>
      <style>
        {`
          body {
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );

  if (isFirstRender) return null;

  return reactDOM.createPortal(
    ModalContent,
    document.getElementById('modal-root') as Element
  );
};

export default Modal;
