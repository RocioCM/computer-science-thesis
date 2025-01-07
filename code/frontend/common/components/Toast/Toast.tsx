import { ToastContainer } from 'react-toastify';
import Img from '@/common/components/Img';
import cn from '@/common/utils/classNames';
import iconInfo from '@/public/assets/icon-toast-info.svg';
import iconSuccess from '@/public/assets/icon-toast-success.svg';
import iconWarning from '@/public/assets/icon-toast-warning.svg';
import iconError from '@/public/assets/icon-toast-error.svg';
import iconDark from '@/public/assets/icon-toast-dark.svg';

const TOAST_BASE_STYLE =
  'px-m rounded-rs text-h5 font-semibold leading-tight shadow-none';

const TOAST_TYPES_STYLES = {
  info: '!bg-fi2 !text-fi1 border border-fi1',
  success: '!bg-fs2 !text-fs1 border border-fs1',
  warning: '!bg-fw2 !text-fw1 border  border-fw1',
  error: '!bg-fe2 !text-fe1 border border-fe1',
  default: 'bg-n1 text-n10 border border-n10',
};

const PROGRESS_BASE_STYLE = 'h-xs';

const PROGRESS_TYPES_STYLES = {
  info: '!bg-fi1',
  success: '!bg-fs1',
  warning: '!bg-fw1',
  error: '!bg-fe1',
  default: 'bg-n10',
};

const ICONS = {
  info: iconInfo,
  success: iconSuccess,
  warning: iconWarning,
  error: iconError,
  default: iconDark,
};

interface Props {}

const Toast: React.FC<Props> = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={6000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={false}
      theme="colored"
      bodyClassName="p-0"
      icon={(props) => {
        // NOTE: You can set this prop to icon={false} to completely hide icons on every toast.
        const icon = ICONS[props.type];
        if (!icon) return false; // Hide icon
        return <Img className="w-l h-l" src={icon} alt={props.type} />;
      }}
      toastClassName={(context) => {
        if (!context) return '';
        return cn(
          context.defaultClassName,
          TOAST_BASE_STYLE,
          context.type ? TOAST_TYPES_STYLES[context.type] : ''
        );
      }}
      progressClassName={(context) => {
        if (!context) return '';
        return cn(
          context.defaultClassName,
          PROGRESS_BASE_STYLE,
          context.type ? PROGRESS_TYPES_STYLES[context.type] : ''
        );
      }}
    />
  );
};

export default Toast;
