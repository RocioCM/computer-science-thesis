import cn from '@/common/utils/classNames';
import { useMemo } from 'react';

const WIDTH_STYLE = 'w-full';
const TITLE_STYLE =
  'font-semibold mb-s text-ellipsis overflow-hidden whitespace-nowrap';

const CONTAINER_STYLE = 'h-s bg-gray-200 rounded-full';
const PRIMARY_BAR_STYLE = 'rounded-full bg-p1';
const SECONDARY_BAR_STYLE = 'rounded-full bg-p2 opacity-60';

const POINT_STYLE = 'w-m h-m bg-p2 top-[-0.15rem]';
const POINT_LABEL_STYLES = 'text-s';

interface Point {
  status: number;
  label?: string;
}

interface Props {
  status: number;
  secondaryStatus?: number;
  className?: string;
  specialPoints?: Point[];
  title?: string;
  indicatorPosition?:
    | 'none'
    | 'top-end'
    | 'float-top'
    | 'float-bottom'
    | 'end'
    | 'inside';
}

/**
 * A progress bar that shows the progress of a task.
 * @param  status - A number between 0 and 1 that represents the progress of the bar.
 * @param  secondaryStatus - A number between 0 and 1 that represents the progress of the secondary bar.
 * It's shown as a shadow on the main bar, so it should be more than the main status to be visible.
 * @param  specialPoints - An array of objects representing special points in the bar.
 * Each object should have a status and label.
 * @param  className - Additional classes to apply to the component.
 */
const ProgressBar = ({
  status = 0,
  className = '',
  specialPoints = [],
  secondaryStatus = 0,
  title = '',
  indicatorPosition = 'none', /// TODO: define figma pending
}: Props) => {
  const barWidth = Math.max(0, Math.min(status * 100, 100));
  const secondaryBarWidth = Math.max(0, Math.min(secondaryStatus * 100, 100));

  const shouldHavePadding = useMemo(() => {
    return specialPoints && specialPoints.some((point) => point.label);
  }, [specialPoints]);

  return (
    <div className={cn('relative', WIDTH_STYLE)}>
      <div className="flex flex-row items-center justify-between">
        <h6 className={cn('flex-1', TITLE_STYLE)} title={title}>
          {title}
        </h6>
      </div>
      <div
        className={cn(
          'relative w-full',
          shouldHavePadding ? 'mb-6' : '',
          CONTAINER_STYLE,
          className
        )}
      >
        {secondaryBarWidth > 0 && (
          <div
            className={cn(
              'absolute h-full', // Base
              'animate__animated animate__slideInLeft transition-[width] duration-500 ease-linear', // Animation
              SECONDARY_BAR_STYLE // Custom style
            )}
            title={`${secondaryBarWidth}%`}
            style={{ width: `${secondaryBarWidth}%` }}
          ></div>
        )}

        <div
          className={cn(
            'absolute h-full', // Base
            'animate__animated animate__slideInLeft transition-[width] duration-500 ease-linear', // Animation
            PRIMARY_BAR_STYLE // Custom style
          )}
          title={`${barWidth}%`}
          style={{ width: `${barWidth}%` }}
        ></div>

        {specialPoints?.length > 0 &&
          specialPoints.map((point, index) => (
            <div
              key={index}
              className={cn(
                'absolute rounded-full z-[1] flex items-center justify-center', // Base
                POINT_STYLE // Custom style
              )}
              style={{ left: `calc(${point.status * 100}% - 0.5rem)` }}
            >
              <h6 className={cn('relative top-full w-max', POINT_LABEL_STYLES)}>
                {point.label}
              </h6>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProgressBar;
