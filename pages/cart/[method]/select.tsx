import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetLocationsQuery } from '@/redux/api/locationApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { AppQueryResult, Area, Branch } from '@/types/queries';
import { useEffect, useState, Suspense } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { CircleOutlined, CheckCircle } from '@mui/icons-material';
import { submitBtnClass, suppressText } from '@/constants/*';
import { appSetting } from '@/types/index';
import { setCartMethod } from '@/redux/slices/appSettingSlice';
import { Location } from '@/types/queries';
import { isNull, map } from 'lodash';
import { removeArea, setArea } from '@/redux/slices/areaSlice';
import { useRouter } from 'next/router';
import { removeBranch, setBranch } from '@/redux/slices/branchSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useGetBranchesQuery } from '@/redux/api/branchApi';
import DeliveryBtns from '@/components/widgets/cart/DeliveryBtns';
import TextTrans from '@/components/TextTrans';
import ChangeVendorModal from '@/components/ChangeVendorModal';
import { wrapper } from '@/redux/store';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  previousRoute: string | null;
  method: appSetting['method'];
};
const SelectMethod: NextPage<Props> = ({
  previousRoute,
  method,
}): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    locale: { lang },
    area: selectedArea,
    branch,
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [showChangeLocModal, setShowChangeLocModal] = useState<boolean>(false);
  const { data: locations, isLoading: locationsLoading } =
    useGetLocationsQuery<{
      data: AppQueryResult<Location[]>;
      isLoading: boolean;
    }>({ lang });
  const { data: branches, isLoading: branchesLoading } = useGetBranchesQuery<{
    data: AppQueryResult<Branch[]>;
    isLoading: boolean;
  }>({ lang });
  const [open, setOpen] = useState(0);
  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('select_method')));
    dispatch(setCartMethod(method));
    if (method === `pickup`) {
      dispatch(removeArea());
    } else {
      dispatch(removeBranch());
    }
  }, [method]);

  if (branchesLoading || locationsLoading) {
    return <LoadingSpinner />;
  }

  const Icon = ({ id, open }: { id: number; open: number }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          id === open ? 'rotate-180' : ''
        } h-5 w-5 transition-transform`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const handleNext = async () => {
    if (!previousRoute?.includes(`select`)) {
      router.back();
    } else {
      router.push(`/`);
    }
  };

  return (
    <Suspense>
      <MainContentLayout>
        <div className={`px-4`}>
          <DeliveryBtns />
          <div className={`w-full mb-4`}>
            <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6">
                <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="block w-full focus:ring-1 focus:ring-primary_BG rounded-md  pl-20 border-none  bg-gray-100 py-3 h-16  text-lg capitalize"
                suppressHydrationWarning={suppressText}
                placeholder={`${t(`search`)}`}
              />
            </div>
          </div>
          {method === 'delivery' && (
            <div className={`px-4`}>
              {map(locations.Data, (item: Location, i) => {
                return (
                  <Accordion
                    key={i}
                    open={open === item.id}
                    icon={<Icon id={item.id} open={open} />}
                  >
                    <AccordionHeader
                      className="px-2 pb-0 border-b-0 capitalize"
                      onClick={() => handleOpen(item.id)}
                      suppressHydrationWarning={suppressText}
                    >
                      <TextTrans ar={item.name_ar} en={item.name_en} />
                    </AccordionHeader>
                    <AccordionBody>
                      <div className="bg-LightGray">
                        {map(item.Areas, (a: Area, i) => (
                          <button
                            className={'flex justify-between w-full p-4 '}
                            key={i}
                            onClick={() => dispatch(setArea(a))}
                          >
                            <p
                              className="text-base text-black capitalize"
                              suppressHydrationWarning={suppressText}
                            >
                              <TextTrans ar={a.name_ar} en={a.name_en} />
                            </p>
                            {a.id === selectedArea.id ? (
                              <CheckCircle style={{ color }} />
                            ) : (
                              <CircleOutlined className="text-gray-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </AccordionBody>
                  </Accordion>
                );
              })}
            </div>
          )}
          {method === 'pickup' && (
            <div className="px-4">
              <p
                className="p-3 capitalize"
                style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {t('select_branch')}
              </p>
              <div className={`bg-LightGray p-3`}>
                {map(branches?.Data, (b: Branch, i) => (
                  <button
                    key={i}
                    onClick={() => dispatch(setBranch(b))}
                    className={`flex flex-row  w-full justify-between items-center p-1`}
                  >
                    <label
                      htmlFor={b.name}
                      className="py-1 form-check-label capitalize"
                    >
                      <p>
                        <TextTrans ar={b.name_ar} en={b.name_en} />
                      </p>
                    </label>
                    <input
                      className="form-check-input appearance-none rounded-full h-5 w-5 border border-gray-200 focus:ring-gray-100 focus:ring-offset-1 focus:border-2  focus:border-gray-100 checked:border-gray-400 bg-gray-100 checked:bg-gray-400 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      style={{ color }}
                      type="radio"
                      name="branch"
                      readOnly
                      checked={branch.id === b.id}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => handleNext()}
            disabled={isNull(selectedArea.id) && isNull(branch.id)}
            className={`${submitBtnClass} mt-12 capitalize`}
            style={{ backgroundColor: color }}
            suppressHydrationWarning={suppressText}
          >
            {t('confirm')}
          </button>
        </div>
        <ChangeVendorModal
          SelectedAreaOrBranch={method === `delivery` ? branch : selectedArea}
          OpenModal={showChangeLocModal}
          previousRoute={previousRoute ?? null}
          OnClose={() => setShowChangeLocModal(false)}
        />
      </MainContentLayout>
    </Suspense>
  );
};

export default SelectMethod;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      const { method }: any = query;
      if (!method) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          previousRoute: req.headers.referer ?? null,
          method,
        },
      };
    }
);
