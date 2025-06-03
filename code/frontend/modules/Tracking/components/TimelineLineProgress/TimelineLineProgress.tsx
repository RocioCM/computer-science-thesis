import { useEffect, useState } from 'react';
import classNames from '@/common/utils/classNames';
import { TabsData } from '../../types';

const TimelineLineWithDots = ({ tabsData }: { tabsData: TabsData }) => {
  const steps: (keyof TabsData)[] = [
    'baseBatch',
    'productBatch',
    'wasteBottle',
    'recyclingBatch',
  ];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let filled = 0;
    for (let i = 0; i < steps.length - 1; i++) {
      const currentHasId = !!tabsData?.[steps[i]]?.id;
      const nextHasId = !!tabsData?.[steps[i + 1]]?.id;
      if (currentHasId && nextHasId) filled++;
      else break;
    }

    let i = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < filled) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [tabsData]);

  return (
    <div
      className="grid w-full items-center gap-0 px-[3rem]"
      style={{
        gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr auto',
      }}
    >
      {steps.map((_, index) => {
        const tabData = tabsData[steps[index]];
        const next = steps[index + 1];
        const nextHasId = !!tabsData?.[next]?.id;
        const currentHasId = !!tabData?.id;
        const isFilled = index < progress;
        const isDashed = !(currentHasId && nextHasId);
        const date = new Date(
          tabData?.createdAt || new Date().toISOString()
        ).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        console.log(date);
        const tabDisabled =
          !tabData &&
          Array.isArray(tabsData?.[steps[index]]) &&
          (tabsData?.[steps[index]] as any)?.length === 0;
        return (
          <>
            <div className="flex justify-center">
              <span
                title={tabData ? date : ''}
                className={classNames(
                  'rounded-full w-5 h-5 border shrink-0 z-10',
                  tabData
                    ? 'bg-p1 border-p3 animate__animated animate__fadeIn animate__faster cursor-pointer'
                    : !tabDisabled
                    ? 'bg-n0 border-p1'
                    : 'bg-bg border-n3'
                )}
              ></span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={classNames(
                  'h-[2px] w-full transition-all duration-300 ',
                  isFilled && !isDashed
                    ? 'bg-p1'
                    : isDashed
                    ? 'border-t-2 border-dashed border-n3'
                    : ''
                )}
              ></div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default TimelineLineWithDots;
