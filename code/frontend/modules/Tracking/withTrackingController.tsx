import { useState, useEffect } from 'react';
import { TrackingViewType, TrackingViewProps, TabsData } from './types';
import useForm from '@/common/hooks/useForm';
import TrackingServices from './services';
import { toast } from 'react-toastify';
import BaseBatchTab from './components/BaseBatchTab';
import ProductBatchTab from './components/ProductBatchTab';
import WasteBottleTab from './components/WasteBottleTab';
import RecyclingBatchTab from './components/RecyclingBatchTab';
import { SEARCH_FORM_STRUCT, TABS_KEYS } from './constants';
const withTrackingController = (View: TrackingViewType) =>
  function Controller(): JSX.Element {
    const { form, handleChange, submitEnabled } = useForm(SEARCH_FORM_STRUCT);
    const [currentTab, setCurrentTab] = useState<string | null>(null);
    const [tabsData, setTabsData] = useState<TabsData>({});
    const [tabsIdsOptions, setTabsIdsOptions] = useState<
      Record<
        string,
        { page: number; items: { label: string; value: number }[] }
      >
    >({});

    const handleIdChange = (name: string, value: string) => {
      if (value !== '' && form.type !== TABS_KEYS.PRODUCT_BATCH) {
        const numberValue = Number(value);
        const isNumber = !isNaN(numberValue);
        if (isNumber && numberValue >= 0 && parseInt(value) === numberValue) {
          handleChange(name, numberValue || '');
        }
      } else {
        handleChange(name, value);
      }
    };

    const fetchBaseBatch = async (id: number, fetchOptions = true) => {
      const { ok, data } = await TrackingServices.getBaseBottlesBatchById(id);
      if (ok && data) {
        setTabsData((prev) => ({ ...prev, [TABS_KEYS.BASE_BATCH]: data }));
        if (fetchOptions) fetchProductBatchOptions(id, 1);
      } else {
        toast.error('No encontramos el lote base que buscas, revisa el ID');
      }
    };

    const fetchProductBatchByCode = async (
      trackingCode: string,
      fetchOptions = true
    ) => {
      const { ok, data } = await TrackingServices.getProductBatchByCode(
        trackingCode
      );
      if (ok && data) {
        setTabsData((prev) => ({ ...prev, [TABS_KEYS.PRODUCT_BATCH]: data }));
        fetchBaseBatch(data.originBaseBatchId, false);
        if (fetchOptions) fetchWasteBottlesFromProductBatch(data.id, 1);
      } else {
        toast.error(
          'No encontramos el lote de producto que buscas, revisa el código de seguimiento'
        );
      }
    };

    const fetchProductBatchById = async (id: number) => {
      const { ok, data } = await TrackingServices.getProductBatchById(id);
      if (ok && data) {
        setTabsData((prev) => ({ ...prev, [TABS_KEYS.PRODUCT_BATCH]: data }));
        fetchWasteBottlesFromProductBatch(data.id, 1);
      } else {
        toast.error(
          'No encontramos el lote de producto que buscas, revisa el código de seguimiento'
        );
      }
    };

    const fetchWasteBottle = async (id: number) => {
      const { ok, data } = await TrackingServices.getWasteBottleById(id);
      if (ok && data) {
        setTabsData((prev) => ({ ...prev, [TABS_KEYS.WASTE_BOTTLE]: data }));
        if (
          data.recycledBatchId &&
          tabsData.recyclingBatch?.id !== data.recycledBatchId
        ) {
          fetchRecyclingBatch(data.recycledBatchId);
        }
        if (data.trackingCode !== tabsData.productBatch?.trackingCode) {
          fetchProductBatchByCode(data.trackingCode, false);
        }
      } else {
        toast.error(
          'No encontramos la botella reciclada que buscas, revisa el ID'
        );
      }
    };

    const fetchRecyclingBatch = async (id: number) => {
      const { ok, data } = await TrackingServices.getRecyclingBatchById(id);
      if (ok && data) {
        setTabsData((prev) => ({ ...prev, [TABS_KEYS.RECYCLING_BATCH]: data }));
        setTabsIdsOptions((prev) => ({
          ...prev,
          [TABS_KEYS.WASTE_BOTTLE]: {
            page: 1,
            items: [
              ...(prev[TABS_KEYS.WASTE_BOTTLE]?.items || []),
              ...data.wasteBottleIds.map((id) => ({
                label: `Envase Reciclado #${id}`,
                value: id,
              })),
            ],
          },
        }));
      } else {
        toast.error(
          'No encontramos el lote de material reciclado que buscas, revisa el ID'
        );
      }
    };

    const fetchProductBatchOptions = async (id: number, page: number) => {
      const baseBatchId = id || tabsData.baseBatch?.id;
      if (!baseBatchId) return;

      const { ok, data } = await TrackingServices.getAllProductsFromBaseBatch(
        baseBatchId,
        page,
        20
      );
      if (ok && data) {
        setTabsIdsOptions((prev) => ({
          ...prev,
          [TABS_KEYS.PRODUCT_BATCH]: {
            page,
            items: [
              ...(prev[TABS_KEYS.PRODUCT_BATCH]?.items || []),
              ...data.map((id) => ({
                label: `Lote de Productos #${id}`,
                value: id,
              })),
            ],
          },
        }));
      }
    };

    const fetchWasteBottlesFromProductBatch = async (
      productBatchId: number,
      page: number
    ) => {
      const { ok, data } =
        await TrackingServices.getAllWasteBottlesFromProductBatchById(
          productBatchId,
          page,
          20
        );
      if (ok && data) {
        setTabsIdsOptions((prev) => ({
          ...prev,
          [TABS_KEYS.WASTE_BOTTLE]: {
            page,
            items: [
              ...(prev[TABS_KEYS.WASTE_BOTTLE]?.items || []),
              ...data.map((id) => ({
                label: `Envase Reciclado #${id}`,
                value: id,
              })),
            ],
          },
        }));
      }
    };

    const handleSearch = async () => {
      const { type, id } = form;
      if (!type || !id) return;

      // First of all, reset previous search.
      setTabsData({});
      setTabsIdsOptions({});
      setCurrentTab(null);

      if (type === TABS_KEYS.BASE_BATCH) {
        await fetchBaseBatch(id);
      } else if (type === TABS_KEYS.PRODUCT_BATCH) {
        await fetchProductBatchByCode(id);
      }
      if (type === TABS_KEYS.WASTE_BOTTLE) {
        await fetchWasteBottle(id);
      }
      if (type === TABS_KEYS.RECYCLING_BATCH) {
        await fetchRecyclingBatch(id);
      }
      setCurrentTab(type);
    };

    const getCurrentTabContent = (tab: string | null) => {
      if (tab === TABS_KEYS.BASE_BATCH) {
        return <BaseBatchTab batch={tabsData.baseBatch!} />;
      } else if (tab === TABS_KEYS.PRODUCT_BATCH) {
        return (
          <ProductBatchTab
            batch={tabsData.productBatch}
            options={tabsIdsOptions[TABS_KEYS.PRODUCT_BATCH]?.items || []}
            handleOption={(optionId) => fetchProductBatchById(optionId)}
          />
        );
      } else if (tab === TABS_KEYS.WASTE_BOTTLE) {
        return (
          <WasteBottleTab
            bottle={tabsData.wasteBottle}
            options={tabsIdsOptions[TABS_KEYS.WASTE_BOTTLE]?.items || []}
            handleOption={(optionId) => fetchWasteBottle(optionId)}
          />
        );
      } else if (tab === TABS_KEYS.RECYCLING_BATCH) {
        return <RecyclingBatchTab batch={tabsData.recyclingBatch} />;
      }
    };

    useEffect(() => {
      handleChange('id', '');
    }, [form.type]);

    const viewProps: TrackingViewProps = {
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
    };

    return <View {...viewProps} />;
  };

export default withTrackingController;
