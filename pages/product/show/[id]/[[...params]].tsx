import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import {
  CheckBoxes,
  Product,
  ProductSection,
  QuantityMeters,
  img,
} from '@/types/index';
import { productApi, useGetProductQuery } from '@/redux/api/productApi';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState, Fragment, Suspense } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {
  resetShowFooterElement,
  setCurrentModule,
  setShowFooterElement,
  setUrl,
} from '@/redux/slices/appSettingSlice';
import {
  arboriaFont,
  baseUrl,
  imageSizes,
  imgUrl,
  isLocal,
  suppressText,
  toEn,
} from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import {
  concat,
  filter,
  first,
  groupBy,
  isEmpty,
  isNull,
  join,
  map,
  multiply,
  now,
  startCase,
  sum,
  sumBy,
} from 'lodash';
import {
  addMeter,
  addRadioBtn,
  addToCheckBox,
  disableAddToCart,
  enableAddToCart,
  removeFromCheckBox,
  removeMeter,
  resetCheckBoxes,
  resetMeters,
  resetRadioBtns,
  setCartProductQty,
  setInitialProductCart,
  setNotes,
  updateId,
  updatePrice,
} from '@/redux/slices/productCartSlice';
import { Accordion, AccordionBody } from '@material-tailwind/react';
import TextTrans from '@/components/TextTrans';
import { themeColor } from '@/redux/slices/vendorSlice';
import NoFoundImage from '@/appImages/not_found.png';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

type Props = {
  product: Product;
  url: string;
  currentLocale: string;
  resolvedUrl: string;
};
const ProductShow: NextPage<Props> = ({
  product,
  url,
  currentLocale,
  resolvedUrl,
}) => {
  const { t } = useTranslation();
  const {
    productCart,
    locale: { lang, isRTL },
    branch: { id: branch_id },
    area: { id: area_id },
    cart: { total },
    vendor: { logo },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [currentQty, setCurrentyQty] = useState<number>(
    productCart.ProductID === product.id ? productCart.Quantity : 1
  );
  const [outOfStock, setOutOfStock] = useState<boolean>(false);
  const [tabsOpen, setTabsOpen] = useState<{ id: number }[]>([]);
  const [isReadMoreShown, setIsReadMoreShown] = useState<boolean>(false);
  const {
    data: element,
    isSuccess,
    refetch: refetchGetProduct,
  } = useGetProductQuery({
    id: product.id,
    lang,
    ...(branch_id && { branch_id }),
    ...(area_id && { area_id }),
    url,
  });

  useEffect(() => {
    if (isSuccess && element.Data) {
      dispatch(
        setCurrentModule(
          isRTL ? element?.Data?.name_ar : element?.Data?.name_en
        )
      );
      if (productCart.ProductID !== element?.Data?.id) {
        handleResetInitialProductCart();
      }
      if (element?.Data?.sections?.length === 0) {
        dispatch(enableAddToCart());
      }
      if (
        element?.Data?.sections?.length !== 0 &&
        element?.Data?.sections?.filter(
          (itm) => itm.selection_type === 'mandatory'
        ).length === 0
      ) {
        dispatch(enableAddToCart());
      }
      if (total > 0) {
        dispatch(resetRadioBtns());
        dispatch(resetCheckBoxes());
        dispatch(resetMeters());
      }
      if (
        element?.Data?.amount === 0 &&
        element?.Data?.never_out_of_stock === 0
      ) {
        setOutOfStock(true);
      } else if (element?.Data?.never_out_of_stock === 1) {
        setOutOfStock(false);
      }
    }
  }, [isSuccess, element?.Data?.id, isRTL]);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    dispatch(setShowFooterElement(`product_show`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, [product]);

  const handleValidateMendatory = () => {
    const requiredSections = filter(
      element?.Data?.sections,
      (c) => c.selection_type === 'mandatory'
    );

    // console.log('pro cart', productCart);
    // console.log('required sec', requiredSections);

    for (const i in requiredSections) {
      // radio btns
      if (requiredSections[i].must_select === 'single') {
        // rb is short for checkbox
        let rbExist =
          productCart.RadioBtnsAddons.filter(
            (rb) => rb.addonID === requiredSections[i].id && rb.addons.Value
          ).length > 0;

        console.log('rbExist', rbExist);
        if (!rbExist) {
          return false;
        }
      }

      // checkboxes
      if (requiredSections[i].must_select === 'multi') {
        // cb is short for checkbox
        let cbExist =
          productCart.CheckBoxes.filter(
            (cb) => cb.addonID === requiredSections[i].id && cb.addons[0].Value
          ).length > 0;

        console.log('cbExist', cbExist);
        if (!cbExist) {
          return false;
        }
      }

      // qmeter
      if (requiredSections[i].must_select === 'q_meter') {
        let sumValue = 0;
        let qmExist =
          productCart.QuantityMeters.filter((qm) => {
            if (qm.addonID === requiredSections[i].id && qm.addons[0].Value) {
              sumValue += qm.addons[0].Value;
              return qm;
            }
          }).length > 0;

        console.log('qmExist', qmExist, sumValue, requiredSections[i].min_q);
        if (!qmExist || sumValue < requiredSections[i].min_q) {
          return false;
        }
      }
    }

    return true;
  };

  const handleValidateMinQty = () => {
    const groupByCheckboxes = groupBy(productCart.CheckBoxes, 'addonID');

    // checkboxes review min quantities
    for (const item in groupByCheckboxes) {
      const sumOfSelectedChoices = sumBy(
        groupByCheckboxes[item],
        (itm) => itm.addons[0].Value
      );

      const minQty = filter(
        element?.Data?.sections,
        (addon) => addon.id === parseInt(item)
      )[0].min_q;

      if (sumOfSelectedChoices < minQty) {
        return false;
      }

      // console.log(
      //   { item },
      //   groupByCheckboxes[item],
      //   { sumOfSelectedChoices },
      //   { minQty }
      // );
    }

    // console.log({ groupByCheckboxes });
    return true;
  };

  useEffect(() => {
    if (
      isSuccess &&
      !isNull(element) &&
      !isNull(element.Data) &&
      !isEmpty(productCart) &&
      (currentQty > 0 ||
        (element?.Data?.amount >= 0 && element?.Data?.never_out_of_stock === 1))
    ) {
      const allCheckboxes = map(productCart.CheckBoxes, (q) => q.addons[0]);
      const allRadioBtns = map(productCart.RadioBtnsAddons, (q) => q.addons);
      const allMeters = map(productCart.QuantityMeters, (q) => q.addons[0]);
      const metersSum = sumBy(allMeters, (a) => multiply(a.price, a.Value)); // qty
      const checkboxesSum = sumBy(allCheckboxes, (a) => a.Value * a.price); // qty
      const radioBtnsSum = sumBy(allRadioBtns, (a) => a.Value * a.price); // qty
      const requiredMeters = filter(
        element?.Data?.sections,
        (c) => c.must_select === 'q_meter' && c.selection_type === 'mandatory'
      );
      const requiredRadioBtns = filter(
        element?.Data?.sections,
        (c) => c.must_select === 'single' && c.selection_type === 'mandatory'
      );
      const requiredCheckboxes = filter(
        element?.Data?.sections,
        (c) => c.must_select === 'multi' && c.selection_type === 'mandatory'
      );

      handleValidateMinQty();

      if (
        (requiredRadioBtns.length > 0 && allRadioBtns.length === 0) ||
        (requiredRadioBtns.length > 0 &&
          allRadioBtns.length < requiredRadioBtns.length) ||
        (requiredMeters.length > 0 && allMeters.length === 0) ||
        (requiredMeters.length > 0 &&
          allMeters.length < requiredMeters.length) ||
        (requiredCheckboxes.length > 0 && allCheckboxes.length === 0) ||
        (requiredCheckboxes.length > 0 &&
          allCheckboxes.length < requiredCheckboxes.length)
      ) {
        dispatch(disableAddToCart());
      } else {
        // to execute the for looop only when all those if conditions is failed
        const MendatoryValidation = handleValidateMendatory();
        const minValueValidation = handleValidateMinQty();
        console.log({ MendatoryValidation }, { minValueValidation });
        if (!MendatoryValidation || !minValueValidation) {
          dispatch(disableAddToCart());
        } else {
          dispatch(enableAddToCart());
        }
      }

      dispatch(
        updatePrice({
          totalPrice: sum([
            parseFloat(
              element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
                ? element?.Data?.new_price
                : element?.Data?.price
            ),
            metersSum,
            checkboxesSum,
            radioBtnsSum,
          ]),
          totalQty: currentQty,
        })
      );
      const uIds = concat(
        productCart.QuantityMeters &&
          map(productCart.QuantityMeters, (q) => `_${q.uId2}`),
        productCart.CheckBoxes &&
          map(productCart.CheckBoxes, (c) => `_${c.uId}`),
        productCart.RadioBtnsAddons &&
          map(productCart.RadioBtnsAddons, (r) => `_${r.uId}`),
        ` _${productCart.ExtraNotes.replace(/[^A-Z0-9]/gi, '')}`
      );
      dispatch(updateId(`${productCart.ProductID}${join(uIds, '')}`));
    }
  }, [
    productCart.QuantityMeters,
    productCart.CheckBoxes,
    productCart.RadioBtnsAddons,
    currentQty,
    productCart.ExtraNotes,
  ]);

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const handleIncrease = () => {
    if (element && !outOfStock) {
      setCurrentyQty(currentQty + 1);
      dispatch(setCartProductQty(currentQty + 1));
    }
  };

  const handleDecrease = () => {
    if (isSuccess && !isNull(element)) {
      if (currentQty - 1 > 0) {
        setCurrentyQty(currentQty - 1);
        dispatch(setCartProductQty(currentQty - 1));
      } else {
        setCurrentyQty(0);
        handleResetInitialProductCart();
      }
    }
  };

  const handleResetInitialProductCart = () => {
    if (isSuccess && !isNull(element) && element.Data) {
      dispatch(
        setInitialProductCart({
          ProductID: element?.Data?.id,
          ProductName: element?.Data?.name,
          ProductImage: element?.Data?.cover ?? ``,
          ProductNameAr: element?.Data?.name_ar,
          ProductNameEn: element?.Data?.name_en,
          ProductDesc: element?.Data?.desc,
          Quantity: currentQty,
          ExtraNotes: ``,
          totalPrice: parseFloat(
            element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
              ? element?.Data?.new_price
              : element?.Data?.price
          ),
          grossTotalPrice: parseFloat(
            element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
              ? element?.Data?.new_price
              : element?.Data?.price
          ),
          totalQty: currentQty,
          Price: parseFloat(
            element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
              ? element?.Data?.new_price
              : element?.Data?.price
          ),
          enabled:
            filter(
              element?.Data.sections,
              (s) => s.selection_type === 'mandatory'
            ).length === 0 &&
            element?.Data?.amount >= 0 &&
            element?.Data?.never_out_of_stock === 1,
          image: imgUrl(element?.Data.img[0]?.toString()),
          id: now().toString(),
        })
      );
    }
  };

  const handleSelectAddOn = async (
    selection: ProductSection,
    choice: any,
    type: string,
    checked: boolean
  ) => {
    if (type === 'checkbox') {
      if (checked) {
        const checkboxMaxQty = filter(
          element?.Data?.sections,
          (c) => c.id === selection.id
        )[0].max_q;

        const checkboxSelectedQty = filter(
          productCart.CheckBoxes,
          (c) => c.addonID === selection.id
        ).length;

        // if max val disable checkbox
        if (checkboxSelectedQty + 1 <= checkboxMaxQty) {
          dispatch(
            addToCheckBox({
              addonID: selection.id,
              uId: `${selection.id}${choice.id}${choice.name_en}`,
              addons: [
                {
                  attributeID: choice.id,
                  name: choice.name,
                  name_ar: choice.name_ar,
                  name_en: choice.name_en,
                  Value: 1,
                  price: parseFloat(choice.price),
                },
              ],
            })
          );
        }
      } else {
        dispatch(
          removeFromCheckBox(`${selection.id}${choice.id}${choice.name_en}`)
        );
      }
    } else if (type === 'radio') {
      dispatch(
        addRadioBtn({
          addonID: selection.id,
          uId: `${selection.id}${choice.id}${choice.name_en}`,
          addons: {
            attributeID: choice.id,
            name: choice.name,
            name_ar: choice.name_ar,
            name_en: choice.name_en,
            Value: 1,
            price: parseFloat(choice.price),
          },
        })
      );
    } else if (type === 'q_meter') {
      const currentMeter = filter(
        productCart.QuantityMeters,
        (q: QuantityMeters) =>
          q.uId === `${selection.id}${choice.id}` && q.addons[0]
      );

      if (checked) {
        // to disable on max qty
        const currentSelectionAddonsValues = filter(
          productCart.QuantityMeters,
          (q: QuantityMeters) => {
            if (q.addonID === selection.id && q.addons[0])
              return q.addons[0].Value;
          }
        );
        const sumSelectedMeterValues = sumBy(
          currentSelectionAddonsValues,
          (qm) => qm.addons[0].Value
        );

        // console.log(
        //   currentSelectionAddonsValues,
        //   { currentMeter },
        //   { sumSelectedMeterValues },
        //   selection.max_q
        // );

        // update value and check max qty
        const Value =
          sumSelectedMeterValues + 1 <= selection.max_q
            ? isEmpty(currentMeter)
              ? 1
              : parseFloat(currentMeter[0]?.addons[0].Value) + 1
            : isEmpty(currentMeter)
            ? 0
            : parseFloat(currentMeter[0]?.addons[0].Value);

        dispatch(
          addMeter({
            addonID: selection.id,
            uId2: `${selection.id}${choice.id}${Value}`,
            uId: `${selection.id}${choice.id}`,
            addons: [
              {
                attributeID: choice.id,
                name: choice.name,
                name_ar: choice.name_ar,
                name_en: choice.name_en,
                Value,
                price: parseFloat(choice.price),
              },
            ],
          })
        );
      } else {
        // decrease
        if (!isEmpty(currentMeter)) {
          const Value = isEmpty(currentMeter)
            ? 1
            : parseFloat(currentMeter[0]?.addons[0].Value) - 1 >= 0
            ? parseFloat(currentMeter[0]?.addons[0].Value) - 1
            : parseFloat(currentMeter[0]?.addons[0].Value);

          dispatch(
            addMeter({
              addonID: selection.id,
              uId2: `${selection.id}${choice.id}${Value}`,
              uId: `${selection.id}${choice.id}`,
              addons: [
                {
                  attributeID: choice.id,
                  name: choice.name,
                  name_ar: choice.name_ar,
                  name_en: choice.name_en,
                  Value,
                  price: parseFloat(choice.price),
                },
              ],
            })
          );
        } else {
          dispatch(removeMeter(`${selection.id}${choice.id}`));
        }
      }
    }
  };

  if (!isSuccess || !url) {
    return <LoadingSpinner fullWidth={true} />;
  }

  console.log('out of stock', outOfStock);
  return (
    <Suspense>
      <MainHead
        title={`${currentLocale === 'ar' ? product.name_ar : product.name_en}`}
        description={`${
          currentLocale === 'ar'
            ? product.description_ar
            : product.description_en
        }`}
        mainImage={`${product?.cover.toString()}`}
        icon={`${logo}`}
        twitter={`${url}${resolvedUrl}`}
        facebook={`${url}${resolvedUrl}`}
        instagram={`${url}${resolvedUrl}`}
      />
      <MainContentLayout
        url={url}
        productCurrentQty={currentQty}
        handleIncreaseProductQty={handleIncrease}
        handleDecreaseProductQty={handleDecrease}
        productOutStock={isSuccess && !isNull(element) && outOfStock}
      >
        {isSuccess && !isNull(element) && element.Data ? (
          <>
            <div className="relative w-full capitalize">
              <div className="relative w-full h-auto overflow-hidden">
                {!isEmpty(element?.Data?.img) ? (
                  <Carousel className={`h-96`}>
                    {map(element?.Data?.img, (image: img, i) => (
                      <div key={i}>
                        <Image
                          src={`${
                            image && image.original
                              ? imgUrl(image.original)
                              : NoFoundImage.src
                          }`}
                          alt={element?.Data?.name ?? ``}
                          width={imageSizes.xxl}
                          height={imageSizes.xxl}
                          className={`object-cover w-full h-96`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <CustomImage
                    src={`${NoFoundImage.src}`}
                    alt={element?.Data?.name}
                    width={imageSizes.xl}
                    height={imageSizes.lg}
                    className={`object-cover w-full h-96`}
                  />
                )}
              </div>
              <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden">
                <div className="flex flex-row w-full px-2 justify-between items-center py-4"></div>
              </div>
            </div>
            <div className={`capitalize mt-5`}>
              {/*   name and desc */}
              <div className="flex flex-row w-full justify-between items-center px-4 md:px-8 pb-4 border-b-2 border-stone-200">
                <div className={` flex-1 space-y-3`}>
                  <p className="font-bold text-xl">
                    <TextTrans
                      ar={element?.Data?.name_ar}
                      en={element?.Data?.name_en}
                      style={{
                        maxWidth: '30ch',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        display: 'block',
                        color: `black`,
                      }}
                    />
                  </p>
                  <p
                    className={`flex flex-wrap rtl:pl-1 ltr:pr-1 ${
                      isReadMoreShown ? '' : 'line-clamp-4'
                    }`}
                  >
                    <TextTrans
                      ar={element?.Data?.description_ar}
                      en={element?.Data?.description_en}
                      length={
                        isReadMoreShown
                          ? isRTL
                            ? element?.Data?.description_ar.length
                            : element?.Data?.description_en.length
                          : 99
                      }
                    />
                    {((element?.Data?.description_ar.length >= 99 && isRTL) ||
                      (element?.Data?.description_en.length >= 99 &&
                        !isRTL)) && (
                      <button
                        onClick={() => setIsReadMoreShown(!isReadMoreShown)}
                        style={{ color }}
                        className="font-semibold text-sm rtl:mr-2 ltr:ml-2"
                      >
                        {isReadMoreShown
                          ? startCase(`${t('read_less')}`)
                          : startCase(`${t('read_more')}`)}
                      </button>
                    )}
                  </p>
                </div>
              </div>
              {/*     sections  */}
              {map(element?.Data?.sections, (s: ProductSection, i) => (
                <div
                  className={`border-b-8 border-stone-100 px-8 py-4`}
                  key={i}
                >
                  <div className="flex flex-row justify-between items-start">
                    <TextTrans ar={s.title_ar} en={s.title_en} />{' '}
                    {isLocal && s.selection_type === 'mandatory' && (
                      <div className="w-auto rounded-lg bg-gray-200 text-black text-xs px-2">
                        {t('required')}
                      </div>
                    )}
                  </div>
                  {s.hidden ? (
                    <div className={`flex flex-col gap-x-2 gap-y-1  mt-2`}>
                      <div className={`flex flex-row`}>
                        <input
                          id={`${s.id}${s.selection_type}`}
                          name={`${s.id}${s.selection_type}`}
                          type="radio"
                          checked={
                            !isEmpty(filter(tabsOpen, (t) => t.id === s.id))
                          }
                          onClick={() =>
                            setTabsOpen([...tabsOpen, { id: s.id }])
                          }
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`${s.id}${s.selection_type}`}
                          className="mx-3 block text-sm font-medium text-gray-700"
                        >
                          {t('yes')}
                        </label>
                      </div>
                      <div className={`flex flex-row`}>
                        <input
                          id={`${s.id}${s.selection_type}`}
                          name={`${s.id}${s.selection_type}`}
                          type="radio"
                          checked={isEmpty(
                            filter(tabsOpen, (t) => t.id === s.id)
                          )}
                          onClick={() => {
                            if (
                              s.selection_type === `optional` &&
                              s.must_select === 'multi'
                            ) {
                              dispatch(resetCheckBoxes());
                            } else {
                              dispatch(resetRadioBtns());
                            }
                            setTabsOpen(filter(tabsOpen, (t) => t.id !== s.id));
                          }}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`${s.id}${s.selection_type}`}
                          className="mx-3 block text-sm font-medium text-gray-700"
                        >
                          {t('no')}
                        </label>
                      </div>
                    </div>
                  ) : null}
                  <Accordion
                    hidden={true}
                    open={
                      !s.hidden
                        ? true
                        : !isEmpty(filter(tabsOpen, (t) => t.id === s.id))
                    }
                    animate={customAnimation}
                    className={`w-full`}
                  >
                    <AccordionBody
                      style={{
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                    >
                      {s.must_select === 'q_meter' &&
                      s.selection_type === 'mandatory' ? (
                        <p className={`flex -w-full text-red-800 pb-3`}>
                          {t(`must_select_min_and_max`, {
                            min: s.min_q,
                            max: s.max_q,
                          })}
                        </p>
                      ) : (
                        s.selection_type === 'mandatory' && (
                          <p className={`flex -w-full text-red-800 pb-3`}>
                            {t(`field_must_select_at_least_one`)}
                          </p>
                        )
                      )}
                      {map(s.choices, (c, i) => (
                        <div className="flex items-center w-full" key={i}>
                          {s.must_select === 'q_meter' ? (
                            <div
                              className={`flex flex-row w-full justify-between items-center`}
                            >
                              <div className={`space-y-1`}>
                                <div>
                                  <p style={{ color }}>
                                    <TextTrans ar={c.name_ar} en={c.name_en} />
                                  </p>
                                </div>
                                <div>
                                  +{c.price}{' '}
                                  <span className={`uppercase`}>
                                    {t(`kwd`)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="isolate inline-flex rounded-xl shadow-sm flex-row-reverse">
                                  <button
                                    disabled={currentQty < 1}
                                    onClick={() =>
                                      handleSelectAddOn(
                                        s,
                                        c,
                                        s.must_select,
                                        true
                                      )
                                    }
                                    type="button"
                                    className="relative -ml-px inline-flex items-center ltr:rounded-l-sm rtl:rounded-r-sm  bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                                    style={{ color }}
                                    data-cy="increase-addon"
                                  >
                                    <span
                                      className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                                    >
                                      +
                                    </span>
                                  </button>
                                  <button
                                    disabled={currentQty === 0}
                                    type="button"
                                    className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium focus:z-10 w-10"
                                    style={{ color }}
                                  >
                                    {filter(
                                      productCart.QuantityMeters,
                                      (q) => q.uId === `${s.id}${c.id}`
                                    )[0]?.addons[0]?.Value ?? 0}
                                  </button>
                                  <button
                                    disabled={
                                      currentQty === 0 ||
                                      first(
                                        filter(
                                          productCart.QuantityMeters,
                                          (q) => q.uId === `${s.id}${c.id}`
                                        )
                                      )?.addons.Value === 0
                                    }
                                    onClick={() =>
                                      handleSelectAddOn(
                                        s,
                                        c,
                                        s.must_select,
                                        false
                                      )
                                    }
                                    type="button"
                                    className="relative inline-flex items-center ltr:rounded-r-sm rtl:rounded-l-sm bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                                    style={{ color }}
                                    data-cy="decrease-addon"
                                  >
                                    <span
                                      className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                                    >
                                      -
                                    </span>
                                  </button>
                                </span>
                              </div>
                            </div>
                          ) : (
                            <Fragment key={i}>
                              <input
                                id={`${c.id}${s.selection_type}${s.title_en}`}
                                name={`${c.id}${s.selection_type}${s.title_en}`}
                                required={s.selection_type !== 'optional'}
                                type={
                                  s.must_select === 'multi'
                                    ? `checkbox`
                                    : 'radio'
                                }
                                checked={
                                  s.must_select !== 'multi'
                                    ? filter(
                                        productCart.RadioBtnsAddons,
                                        (q) =>
                                          q.uId === `${s.id}${c.id}${c.name_en}`
                                      )[0]?.uId === `${s.id}${c.id}${c.name_en}`
                                    : filter(
                                        productCart.CheckBoxes,
                                        (q) =>
                                          q.uId === `${s.id}${c.id}${c.name_en}`
                                      )[0]?.uId === `${s.id}${c.id}${c.name_en}`
                                }
                                onChange={(e) =>
                                  handleSelectAddOn(
                                    s,
                                    c,
                                    s.must_select === 'multi'
                                      ? `checkbox`
                                      : 'radio',
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 border-gray-300   checked:ring-0 focus:ring-0"
                              />
                              <div
                                className={`flex w-full flex-1 justify-between items-center`}
                              >
                                <div>
                                  <label
                                    htmlFor={`${c.id}${s.selection_type}`}
                                    className="ltr:ml-3 rtl:mr-3 block text-sm font-medium text-gray-700"
                                  >
                                    <TextTrans ar={c.name_ar} en={c.name_en} />
                                  </label>
                                </div>
                                <div>
                                  {parseFloat(c.price).toFixed(3)}
                                  <span className={`mx-1 uppercase`}>
                                    {t(`kwd`)}
                                  </span>
                                </div>
                              </div>
                            </Fragment>
                          )}
                        </div>
                      ))}
                    </AccordionBody>
                  </Accordion>
                </div>
              ))}

              {/* notes */}
              <div className="px-8 py-4">
                <p className="mb-2">{t('extra_notes')}</p>
                <input
                  type="text"
                  placeholder={`${t('enter_extra_notes_for_product')}`}
                  suppressHydrationWarning={suppressText}
                  value={productCart.ExtraNotes}
                  onChange={(e) => dispatch(setNotes(toEn(e.target.value)))}
                  className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent capitalize ${arboriaFont}`}
                  data-cy="notesInput"
                />
              </div>
            </div>
          </>
        ) : (
          <div className={`w-full flex h-screen justify-center items-center`}>
            <LoadingSpinner fullWidth={true} />
          </div>
        )}

        <div className="h-36"></div>
      </MainContentLayout>
    </Suspense>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale, req, resolvedUrl }) => {
      const { id, branchId, areaId }: any = query;
      if (!id || !req.headers.host) {
        return {
          notFound: true,
        };
      }
      const {
        data: element,
        isError,
      }: {
        data: AppQueryResult<Product>;
        isError: boolean;
      } = await store.dispatch(
        productApi.endpoints.getProduct.initiate({
          id,
          lang: locale,
          ...(branchId ? { branch_id: branchId } : {}),
          ...(areaId ? { area_id: areaId } : {}),
          url: req.headers.host,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          product: element.Data,
          url: req.headers.host,
          currentLocale: locale,
          resolvedUrl,
        },
      };
    }
);
