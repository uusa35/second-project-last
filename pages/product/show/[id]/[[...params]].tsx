import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { Product, ProductSection, QuantityMeters } from '@/types/index';
import { productApi } from '@/redux/api/productApi';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState, Fragment, Suspense } from 'react';
import {
  resetShowFooterElement,
  setCurrentModule,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { baseUrl, imageSizes, imgUrl, suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import {
  concat,
  filter,
  first,
  isEmpty,
  join,
  map,
  multiply,
  now,
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

type Props = {
  element: Product;
  url: string;
};
const ProductShow: NextPage<Props> = ({ element, url }) => {
  const { t } = useTranslation();
  const { productCart } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [currentQty, setCurrentyQty] = useState<number>(
    productCart.ProductID === element.id ? productCart.Quantity : 1
  );
  const [tabsOpen, setTabsOpen] = useState<{ id: number }[]>([]);
  const firstImage: any = !isEmpty(element.img)
    ? imgUrl(element.img[0].original)
    : NoFoundImage.src;

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
    console.log(productCart.ProductID, element.id);
    if (productCart.ProductID !== element.id) {
      handleResetInitialProductCart();
    }
    dispatch(setShowFooterElement(`product_show`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, [element]);

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  const handleIncrease = () => {
    if (
      element &&
      element.amount &&
      element.amount &&
      element.amount >= currentQty + 1
    ) {
      setCurrentyQty(currentQty + 1);
      dispatch(setCartProductQty(currentQty + 1));
    }
  };

  const handleDecrease = () => {
    if (currentQty - 1 > 0 && element.amount && currentQty <= element.amount) {
      setCurrentyQty(currentQty - 1);
      dispatch(setCartProductQty(currentQty - 1));
    } else {
      setCurrentyQty(0);
      handleResetInitialProductCart();
    }
  };

  const handleResetInitialProductCart = () => {
    dispatch(
      setInitialProductCart({
        ProductID: element.id,
        ProductName: element.name,
        ProductImage: element.img[0]?.thumbnail ?? ``,
        name_ar: element.name_ar,
        name_en: element.name_en,
        ProductDesc: element.desc,
        Quantity: currentQty,
        ExtraNotes: productCart.ExtraNotes,
        totalPrice: parseFloat(element.price),
        grossTotalPrice: parseFloat(element.price),
        totalQty: currentQty,
        Price: parseFloat(element.price),
        enabled: false,
        image: imgUrl(element?.img[0]?.toString()),
        id: now().toString(),
      })
    );
  };

  const handleSelectAddOn = async (
    selection: ProductSection,
    choice: any,
    type: string,
    checked: boolean
  ) => {
    if (type === 'checkbox') {
      if (checked) {
        dispatch(
          addToCheckBox({
            addonID: selection.id,
            uId: `${selection.id}${choice.id}`,
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
      } else {
        dispatch(removeFromCheckBox(`${selection.id}${choice.id}`));
      }
    } else if (type === 'radio') {
      dispatch(
        addRadioBtn({
          addonID: selection.id,
          uId: `${selection.id}${choice.id}`,
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
        // increase
        const Value = isEmpty(currentMeter)
          ? 1
          : parseFloat(currentMeter[0]?.addons[0].Value) + 1 <= selection.max_q
          ? parseFloat(currentMeter[0]?.addons[0].Value) + 1
          : parseFloat(currentMeter[0]?.addons[0].Value);
        dispatch(
          addMeter({
            addonID: selection.id,
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

  useEffect(() => {
    if (isEmpty(productCart.QuantityMeters)) {
      dispatch(disableAddToCart());
    } else {
      const allAddons = map(productCart.QuantityMeters, (q) => q.addons[0]);
      const currentValue = sumBy(allAddons, (a) => a.Value);
      if (currentValue > 0 && currentQty > 0) {
        dispatch(enableAddToCart());
      } else {
        // handleResetInitialProductCart();
        dispatch(disableAddToCart());
      }
    }
  }, [productCart.QuantityMeters]);

  useEffect(() => {
    if (
      !isEmpty(productCart) &&
      currentQty >= 1 &&
      element.amount &&
      element.amount >= currentQty
    ) {
      const allCheckboxes = map(productCart.CheckBoxes, (q) => q.addons[0]);
      const allRadioBtns = map(productCart.RadioBtnsAddons, (q) => q.addons);
      const allMeters = map(productCart.QuantityMeters, (q) => q.addons[0]);
      const metersSum = sumBy(allMeters, (a) => multiply(a.price, a.Value)); // qty
      const checkboxesSum = sumBy(allCheckboxes, (a) => a.Value * a.price); // qty
      const radioBtnsSum = sumBy(allRadioBtns, (a) => a.Value * a.price); // qty
      dispatch(
        updatePrice({
          totalPrice: sum([
            parseFloat(element.price),
            metersSum,
            checkboxesSum,
            radioBtnsSum,
          ]),
          totalQty: currentQty,
        })
      );
      const uIds = concat(
        productCart.QuantityMeters &&
          map(productCart.QuantityMeters, (q) => q.uId),
        productCart.CheckBoxes && map(productCart.CheckBoxes, (c) => c.uId),
        productCart.RadioBtnsAddons &&
          map(productCart.RadioBtnsAddons, (r) => r.uId)
      );
      dispatch(updateId(`${productCart.ProductID}${join(uIds, '')}`));
    }
  }, [
    productCart.QuantityMeters,
    productCart.CheckBoxes,
    productCart.RadioBtnsAddons,
    currentQty,
  ]);

  return (
    <Suspense>
      <MainHead
        title={`${element.name_ar} - ${element.name_en}`}
        description={`${element.description_ar} - ${element.description_en}`}
        mainImage={`${baseUrl}${element?.img[0]?.thumbnail.toString()}`}
      />
      <MainContentLayout
        url={url}
        productCurrentQty={currentQty}
        handleIncreaseProductQty={handleIncrease}
        handleDecreaseProductQty={handleDecrease}
      >
        <div className="relative w-full capitalize">
          <div className="relative w-full h-auto overflow-hidden">
            <CustomImage
              src={`${firstImage}`}
              alt={element.name}
              width={imageSizes.xl}
              height={imageSizes.lg}
              className={`object-cover w-full h-96`}
            />
          </div>
          <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
            />
            <div className="flex flex-row w-full px-2 justify-between items-center py-4"></div>
          </div>
        </div>

        <div className={`capitalize mt-5`}>
          {/*   name and desc */}
          <div className="flex flex-row w-full justify-between items-center px-4 md:px-8 pb-4 border-b-2 border-stone-200">
            <div className={` flex-1 space-y-3`}>
              <p className="font-bold text-xl">
                <TextTrans ar={element.name_ar} en={element.name_en} />
              </p>
              <p className={` rtl:pl-1 ltr:pr-1`}>
                <TextTrans
                  ar={element.description_ar}
                  en={element.description_en}
                />
              </p>
            </div>
            {/* <div className={`shrink-0`}>
              <p className={`text-lg `} style={{ color }}>
                {element.price} <span className={`uppercase`}>{t(`kwd`)}</span>
              </p>
            </div> */}
          </div>
          {/*     sections  */}
          {map(element.sections, (s: ProductSection, i) => (
            <div className={`border-b-8 border-stone-100 px-8 py-4`} key={i}>
              <div>{s.title}</div>
              {s.hidden ? (
                <div className={`flex flex-col gap-x-2 gap-y-1  mt-2`}>
                  <div className={`flex flex-row`}>
                    <input
                      id={s.title}
                      name={s.title}
                      type="radio"
                      checked={!isEmpty(filter(tabsOpen, (t) => t.id === s.id))}
                      onClick={() => setTabsOpen([...tabsOpen, { id: s.id }])}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor={s.title}
                      className="mx-3 block text-sm font-medium text-gray-700"
                    >
                      {t('yes')}
                    </label>
                  </div>
                  <div className={`flex flex-row`}>
                    <input
                      id={s.title}
                      name={s.title}
                      type="radio"
                      checked={isEmpty(filter(tabsOpen, (t) => t.id === s.id))}
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
                      htmlFor={s.title}
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
                              <p style={{ color }}>{c.name}</p>
                            </div>
                            <div>
                              +{c.price}{' '}
                              <span className={`uppercase`}>{t(`kwd`)}</span>
                            </div>
                          </div>
                          <div>
                            <span className="isolate inline-flex rounded-xl shadow-sm flex-row-reverse">
                              <button
                                disabled={currentQty < 1}
                                onClick={() =>
                                  handleSelectAddOn(s, c, s.must_select, true)
                                }
                                type="button"
                                className="relative -ml-px inline-flex items-center ltr:rounded-l-sm rtl:rounded-r-sm  bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                                style={{ color }}
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
                                  handleSelectAddOn(s, c, s.must_select, false)
                                }
                                type="button"
                                className="relative inline-flex items-center ltr:rounded-r-sm rtl:rounded-l-sm bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                                style={{ color }}
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
                            id={c.name}
                            name={c.name}
                            required={s.selection_type !== 'optional'}
                            type={
                              s.must_select === 'multi' ? `checkbox` : 'radio'
                            }
                            checked={
                              s.must_select !== 'multi'
                                ? filter(
                                    productCart.RadioBtnsAddons,
                                    (q) => q.uId === `${s.id}${c.id}`
                                  )[0]?.uId === `${s.id}${c.id}`
                                : filter(
                                    productCart.CheckBoxes,
                                    (q) => q.uId === `${s.id}${c.id}`
                                  )[0]?.uId === `${s.id}${c.id}`
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
                                htmlFor={c.name}
                                className="ltr:ml-3 rtl:mr-3 block text-sm font-medium text-gray-700"
                              >
                                {c.name}
                              </label>
                            </div>
                            <div>
                              {c.price}{' '}
                              <span className={`uppercase`}>{t(`kwd`)}</span>
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
              onChange={(e) => dispatch(setNotes(e.target.value))}
              className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent capitalize`}
            />
          </div>
        </div>

        <div className="h-36"></div>
      </MainContentLayout>
    </Suspense>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale, req }) => {
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
      if (isError || !element.status || !element.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          url: req.headers.host,
        },
      };
    }
);
