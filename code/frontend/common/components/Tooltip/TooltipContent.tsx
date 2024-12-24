import Img from '@/common/components/Img';
import cn from '@/common/utils/classNames';
import infoIcon from '@/public/assets/icon-tooltip-info.svg';

const CONTAINER_STYLE = 'gap-m';
const ICON_STYLE = 'w-m h-m my-1';
const TITLES_CONTAINER_STYLE = 'gap-xs p';
const TITLE_STYLE = 'font-semibold';
const SUBTITLE_STYLE = 's text-n3';

interface Props {
  hideIcon?: boolean;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/** Content that can be used as the content prop of Tooltip and
 * will be rendered as children of the tooltip with icon, title and subtitle format. */
const TooltipContent: React.FC<Props> = ({
  title = '',
  subtitle = '',
  hideIcon = false,
  children = null,
}) => {
  return (
    <div className={cn('flex flex-row', CONTAINER_STYLE)}>
      {!hideIcon && (
        <Img
          src={infoIcon}
          alt="Info"
          className={cn('object-contain', ICON_STYLE)}
        />
      )}
      <div className={cn('flex flex-col', TITLES_CONTAINER_STYLE)}>
        {title && <h6 className={TITLE_STYLE}>{title}</h6>}
        {subtitle && <p className={SUBTITLE_STYLE}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default TooltipContent;
