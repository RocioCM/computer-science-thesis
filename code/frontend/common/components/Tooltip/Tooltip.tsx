import {
  autoUpdate,
  Placement,
  useFloating,
  FloatingPortal,
} from '@floating-ui/react';
import cn from '@/common/utils/classNames';

const TOOLTIP_BASE_STYLE =
  'min-h-[2.5rem] bg-n0 p p-s border border-n2 rounded-rs max-w-[300px]';

const TOOLTIP_POSITION_STYLES: Record<string, string> = {
  top: 'mb-m',
  right: 'ml-m',
  bottom: 'mt-m',
  left: 'mr-m',
};

const ARROW_BASE_STYLE =
  'w-m h-m bg-n0 border border-transparent border-l-n2 border-b-n2';

// Yes, I know :dead: run away from this code if you can.
const ARROW_POSITION_STYLES: Record<Placement, string> = {
  right: 'rotate-45 right-[calc(100%-var(--spacing-m)/2)]',
  'right-start': 'rotate-45 right-[calc(100%-var(--spacing-m)/2)] top-3',
  'right-end': 'rotate-45 right-[calc(100%-var(--spacing-m)/2m)] bottom-3',

  left: 'rotate-[-135deg] left-[calc(100%-var(--spacing-m)/2)]',
  'left-start': 'rotate-[-135deg] left-[calc(100%-var(--spacing-m)/2)] top-3',
  'left-end': 'rotate-[-135deg] left-[calc(100%-var(--spacing-m)/2)] bottom-3',

  top: '-rotate-45 top-[calc(100%-var(--spacing-m)/2)]',
  'top-start': '-rotate-45 top-[calc(100%-var(--spacing-m)/2)] left-3',
  'top-end': '-rotate-45 top-[calc(100%-var(--spacing-m)/2)] right-3',

  bottom: 'rotate-[135deg] bottom-[calc(100%-var(--spacing-m)/2)]',
  'bottom-start':
    'rotate-[135deg] bottom-[calc(100%-var(--spacing-m)/2)] left-3',
  'bottom-end':
    'rotate-[135deg] bottom-[calc(100%-var(--spacing-m)/2)] right-3',
};

export interface Props {
  children: React.ReactNode;
  content: string | React.ReactNode;
  placement?: Placement;
  open?: boolean;
  className?: string;
  anchorClassName?: string;
  hideArrow?: boolean;
  contentRef?: React.RefObject<HTMLElement> | null;
}

/**
 * Tooltip component for displaying additional information.
 * @param children - The anchor that triggers the tooltip.
 * @param open - Flag to control the visibility of the tooltip.
 * @param placement - Position of the tooltip (e.g., top right, bottom left, left center, etc).
 * @param className - Additional CSS class for styling purposes.
 * @param content - Content of the tooltip, can be a string or a React component.
 * @param showArrow - Flag to show the arrow of the tooltip.
 * @param anchorClassName - Additional CSS class for the anchor element.
 * @param contentRef - Optional reference to the tooltip content element.
 */
const Tooltip: React.FC<Props> = ({
  children,
  open = false,
  placement = 'right',
  content,
  hideArrow = false,
  className,
  anchorClassName,
  contentRef = null,
}) => {
  const { refs, floatingStyles } = useFloating({
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      <div ref={refs.setReference} className={anchorClassName}>
        {children}
      </div>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={{ ...floatingStyles }}>
            <div
              ref={contentRef as React.RefObject<HTMLDivElement>}
              className={cn(
                'relative flex items-center justify-center z-tooltip',
                TOOLTIP_BASE_STYLE,
                TOOLTIP_POSITION_STYLES[placement.split('-')[0]],
                className
              )}
            >
              {!hideArrow && (
                <span
                  className={cn(
                    'absolute block',
                    ARROW_BASE_STYLE,
                    ARROW_POSITION_STYLES[placement]
                  )}
                ></span>
              )}
              {content}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
