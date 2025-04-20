import withTrackingController from './withTrackingController';
import { TrackingViewType } from './types';
import Button from '@/common/components/Button';
import InputDropdown from '@/common/components/Inputs/InputDropdown';
import Input from '@/common/components/Inputs/Input';
import FaIcon from '@/common/components/FaIcon';
import cn from '@/common/utils/classNames';
import { TABS_KEYS, TIMELINE_ITEMS } from './constants';

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
    <main className="w-full h-screen p-2xl flex flex-col pb-m">
      <header className="pb-2xl flex items-center justify-between gap-s">
        <h1>Seguimiento</h1>
      </header>

      <div className="flex justify-start items-end gap-m w-full h-max pb-2xl">
        <InputDropdown
          name="type"
          label="Tipo"
          placeholder="Elegir tipo"
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
          containerClassName="!max-w-[20rem] shrink-0"
          handleChange={handleIdChange}
          value={form.id}
          isDisabled={!form.type}
        />
        <Button handleClick={handleSearch} disabled={!submitEnabled}>
          <FaIcon type="fa-solid fa-search" />
          <span>Buscar</span>
        </Button>
      </div>

      <div className="w-full flex-1 flex gap-m">
        <div className="relative bg-n0 shadow-e2 border rounded-lg flex justify-center items-center gap-l w-max min-w-[400px] h-max shrink-0 px-m py-3xl">
          <div className="absolute mr-s bottom-[3.4rem] w-[calc(100%-7.8rem)] border-b-n3 border-2"></div>
          {TIMELINE_ITEMS.map((item) => {
            const tabData = (tabsData as any)[item.key];
            const tabDisabled =
              !tabData && !tabsIdsOptions[item.key]?.items.length;

            return (
              <div
                key={item.key}
                className={cn(
                  'relative flex flex-col items-center gap-xs w-full p-s rounded-lg',
                  !tabDisabled
                    ? 'opacity-100 cursor-pointer hover:bg-p1-25'
                    : 'text-n3 !cursor-default'
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
                <span
                  className={cn(
                    'rounded-full w-5 h-5 border shrink-0 mt-4',
                    tabData
                      ? 'bg-p1 border-p3'
                      : !tabDisabled
                      ? 'bg-n0 border-p1'
                      : 'bg-bg border-n3'
                  )}
                ></span>
              </div>
            );
          })}
        </div>
        <div className="bg-n0 shadow-e2 rounded-lg flex w-full p-m overflow-auto">
          {currentTab ? (
            getCurrentTabContent(currentTab)
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
