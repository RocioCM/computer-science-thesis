import { useEffect } from 'react';
import { ImageProps } from 'next/image';
import Tooltip, { Props as TooltipProps } from './Tooltip';
import Img from '@/common/components/Img';
import useToggle from '@/common/hooks/useToggle';
import useResponsive from '@/common/hooks/useResponsive';
import useClickOutside from '@/common/hooks/useClickOutside';
import infoIcon from '@/public/assets/icon-tooltip-info.svg';

const ICON_STYLE = 'w-l h-l';

interface Props extends Omit<TooltipProps, 'children' | 'content' | 'open'> {
  // Both props are optional, but at least one should be provided.
  // They both provide the content for the tooltip. content has priority over children.
  children?: string | React.ReactNode;
  content?: string | React.ReactNode;
  icon?: ImageProps['src'];
}

/** Information icon that triggers a tooltip with additional information
 * when hovered on desktop or when clicked on mobile. */
const TooltipInfo: React.FC<Props> = ({
  children,
  content,
  icon = infoIcon,
  ...props
}) => {
  const [open, toggleOpen, handleOpen, handleClose] = useToggle(true);
  const tooltipRef = useClickOutside(handleClose); // Hide tooltip on click outside tooltip for mobile.
  const { isMobile } = useResponsive();

  useEffect(() => {
    handleClose();
  }, [isMobile]);

  return (
    <Tooltip
      open={open}
      content={content || children || ''}
      contentRef={tooltipRef}
      placement={isMobile ? 'top' : 'right'}
      {...props}
    >
      <Img
        className={ICON_STYLE}
        src={icon}
        alt="Info"
        role="button"
        tabIndex={0}
        onClick={toggleOpen} // Toggle tooltip on click for mobile
        onMouseEnter={() => !isMobile && handleOpen()} // Show tooltip on hover for desktop
        onMouseLeave={() => !isMobile && setTimeout(handleClose, 150)} // Hide tooltip on hover out for desktop
      />
    </Tooltip>
  );
};

export default TooltipInfo;
