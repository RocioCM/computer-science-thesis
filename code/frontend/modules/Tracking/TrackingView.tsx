import withTrackingController from './withTrackingController';
import { TrackingViewType } from './types';
import Button from '@/common/components/Button';
import InputDropdown from '@/common/components/Inputs/InputDropdown';
import Input from '@/common/components/Inputs/Input';
import FaIcon from '@/common/components/FaIcon';
import cn from '@/common/utils/classNames';
import { TABS_KEYS, TIMELINE_ITEMS } from './constants';
import TimelineLineProgress from './components/TimelineLineProgress';

const TrackingView: TrackingViewType = ({
  form,
  handleChange,
  handleIdChange,
  handleSearch,
  submitEnabled,
  currentTab,
  setCurrentTab,
  tabsData,
  tabsIdsOptions,
  getCurrentTabContent,
}) => {
  return (
    <main className="w-full h-screen p-2xl flex flex-col pb-m animate__animated  animate__fadeIn">
      <header className="pb-2xl flex items-center justify-between gap-s">
        <h1>Seguimiento</h1>
      </header>

      <div className="w-full flex-1 overflow-hidden flex gap-m p-1">
        <div>
          <div className="flex justify-start items-end gap-m w-full pb-3xl">
            <InputDropdown
              name="type"
              label="Tipo"
              placeholder="Elige un tipo"
              options={[
                { label: 'Lote Base', value: TABS_KEYS.BASE_BATCH },
                { label: 'Lote Producto', value: TABS_KEYS.PRODUCT_BATCH },
                { label: 'Botella Reciclada', value: TABS_KEYS.WASTE_BOTTLE },
                { label: 'Lote Reciclaje', value: TABS_KEYS.RECYCLING_BATCH },
              ]}
              className="!bg-n0"
              containerClassName="!w-[12rem] shrink-0"
              handleChange={handleChange}
              value={form.type}
            />
            <Input
              name="id"
              label={
                form.type !== TABS_KEYS.PRODUCT_BATCH
                  ? 'ID'
                  : 'Código de seguimiento'
              }
              placeholder={
                form.type !== TABS_KEYS.PRODUCT_BATCH ? 'Ej: 123' : 'Ej: ABC123'
              }
              inputClassName="!bg-n0"
              containerClassName="flex-1 shrink-0"
              handleChange={handleIdChange}
              value={form.id}
              isDisabled={!form.type}
            />
            <Button handleClick={handleSearch} disabled={!submitEnabled}>
              <FaIcon type="fa-solid fa-search" />
              <span>Buscar</span>
            </Button>
          </div>
          <div className="bg-n0 shadow-e2 border rounded-lg flex flex-col items-center gap-m w-max min-w-[400px] px-m py-3xl">
            <div className="flex justify-center items-end gap-l">
              {TIMELINE_ITEMS.map((item) => {
                const tabData = (tabsData as any)[item.key];
                const tabDisabled =
                  !tabData && !tabsIdsOptions[item.key]?.items.length;

                return (
                  <div
                    key={item.key}
                    className={cn(
                      'flex flex-col items-center gap-xs p-s rounded-lg w-32 h-32',
                      !tabDisabled
                        ? 'opacity-100 cursor-pointer hover:bg-n2 hover:bg-opacity-50'
                        : 'text-n3 !cursor-default',
                      currentTab === item.key ? '!bg-p1-25' : ''
                    )}
                    role="button"
                    onClick={() => {
                      if (!tabDisabled) setCurrentTab(item.key);
                    }}
                  >
                    <div className="w-12 h-12 shrink-0 border border-n3 rounded-md flex justify-center items-center text-center">
                      <FaIcon type={item.icon} className="text-2xl" />
                    </div>
                    <h4 className="uppercase font-semibold">{item.label}</h4>
                    <span className="text-center leading-tight text-n3">
                      {tabData?.id ? `ID #${tabData.id}` : '---'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className=" w-full">
              <TimelineLineProgress tabsData={tabsData} />
            </div>
          </div>
        </div>
        <div className="bg-n0 shadow-e2 rounded-lg flex w-full  p-6 overflow-auto ">
          {currentTab ? (
            <div
              className="animate__animated animate__fadeIn w-full h-full"
              key={currentTab}
            >
              {getCurrentTabContent(currentTab)}{' '}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <FaIcon
                type="fa-solid fa-search"
                className="text-[3rem] text-n4"
              />
              <p className="text-2xl text-n4 mt-4 text-center max-w-[60%]">
                Haz una búsqueda y descubre el ciclo de vida de las botellas
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default withTrackingController(TrackingView);
