import Modal, { ModalProps } from '@/common/components/Modal';
import Button from '@/common/components/Button';
import cn from '@/common/utils/classNames';
import FaIcon from '../../FaIcon';

interface Props extends ModalProps {
  handleConfirm?: () => any;
  handleCancel: () => any;
  title: string;
  subtitle?: string;
  icon?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  disableConfirm?: boolean;
  hideCancel?: boolean;
  hideButtons?: boolean;
}

const CONTAINER_STYLES = 'w-[450px] w-max-full items-center';

const ICON_STYLES =
  'w-12 h-12 shrink-0 flex items-center justify-center text-xl border border-n2 rounded-rs mr-auto';
const TITLE_STYLES =
  'flex gap-2 items-center justify-start text-start font-semibold text-xl';
const SUBTITLE_STYLES = 'text-start';

const TITLES_CTN_STYLES = 'gap-5';
const BTN_CTN_STYLES = 'mt-10 gap-m';

const ConfirmationModal = ({
  title,
  subtitle,
  icon = 'fa-regular fa-flag',
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  handleConfirm = () => {},
  handleCancel = () => {},
  disableConfirm = false,
  hideCancel = false,
  hideButtons = false,
  children,
  ...props
}: Props) => {
  return (
    <Modal
      handleCancel={handleCancel}
      skippable
      hideCloseButton={!hideCancel}
      big={false}
      contentClassName={cn('flex flex-col', CONTAINER_STYLES)}
      {...props}
    >
      <div
        data-testid="confirmation-modal"
        className={cn('flex flex-col w-full', TITLES_CTN_STYLES)}
      >
        <h3 className={TITLE_STYLES}>
          <div className={ICON_STYLES}>
            <FaIcon type={icon} />
          </div>
          <span className="w-full">{title}</span>
        </h3>
        {subtitle && <h6 className={SUBTITLE_STYLES}>{subtitle}</h6>}
      </div>

      {children}

      {!hideButtons && (
        <div className={cn('flex flex-row w-full', BTN_CTN_STYLES)}>
          {!hideCancel && (
            <Button
              label={cancelLabel}
              handleClick={handleCancel}
              variant="secondary"
              width="full"
              className="!h-12"
            />
          )}
          <Button
            label={confirmLabel}
            handleClick={handleConfirm}
            disabled={disableConfirm}
            width="full"
            className="!h-12"
          />
        </div>
      )}
    </Modal>
  );
};

export default ConfirmationModal;
