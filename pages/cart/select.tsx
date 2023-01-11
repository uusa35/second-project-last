import { Suspense } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetLocationsQuery } from '@/redux/api/locationApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { AppQueryResult, Area, Branch } from '@/types/queries';
import { useEffect, useState } from 'react';
import {
  setCartMethod,
  setCurrentModule,
} from '@/redux/slices/appSettingSlice';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { CircleOutlined, CheckCircle } from '@mui/icons-material';
import {
  submitBtnClass,
  normalBtnClass,
  suppressText,
  inputFieldClass,
} from '@/constants/*';
import { Location } from '@/types/queries';
import Image from 'next/image';
import SearchIcon from '@/appIcons/search.svg';
import { isEmpty, isNull, map } from 'lodash';
import { setArea } from '@/redux/slices/areaSlice';
import { appSetting, Cart } from '@/types/index';
import { selectMethod } from '@/redux/slices/cartProductSlice';
import { useRouter } from 'next/router';
import { setBranch } from '@/redux/slices/branchSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SelectMethod: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
    area: selectedArea,
    appSetting: { method },
    branch: { id: branch_id },
  } = useAppSelector((state) => state);
  const { data: locations, isLoading } = useGetLocationsQuery<{
    data: AppQueryResult<Location[]>;
    isLoading: boolean;
  }>({ lang });
  const [open, setOpen] = useState(0);
  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };
  const router = useRouter();
  const dispatch = useAppDispatch();
  console.log('the branches', branches);

  useEffect(() => {
    dispatch(setCurrentModule(t('select_method')));
  }, []);

  if (isLoading) {
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

  const handleSelectArea = (a: Area) => dispatch(setArea(a));

  const handleSelectMethod = (m: appSetting['method']) =>
    dispatch(setCartMethod(m));

  const handleSelectBranch = (b: Branch) => dispatch(setBranch(b));

  return (
    <MainContentLayout>
      <Suspense>
        <div className={`px-4`}>
          <div className="flex flex-1 w-full flex-row justify-between items-center px-14 text-lg py-8 ">
            <button
              className={`${
                method === 'delivery' && `border-b-2 pb-4 border-b-primary_BG`
              } md:ltr:mr-3 md:rtl:ml-3 capitalize `}
              onClick={() => handleSelectMethod(`delivery`)}
              suppressHydrationWarning={suppressText}
            >
              {t('delivery')}
            </button>
            <button
              className={`${
                method === 'pickup' && `border-b-2 pb-4 border-b-primary_BG`
              } md:ltr:mr-3 md:rtl:ml-3 capitalize `}
              onClick={() => handleSelectMethod(`pickup`)}
              suppressHydrationWarning={suppressText}
            >
              {t('pickup')}
            </button>
          </div>
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
                      className="px-2 pb-0 border-b-0"
                      onClick={() => handleOpen(item.id)}
                      suppressHydrationWarning={suppressText}
                    >
                      {t(item.City)}
                    </AccordionHeader>
                    <AccordionBody>
                      <div className="bg-LightGray">
                        {map(item.Areas, (area: Area, i) => (
                          <button
                            className={'flex justify-between w-full p-4 '}
                            key={i}
                            onClick={() => handleSelectArea(area)}
                          >
                            <p
                              className="text-base text-black"
                              suppressHydrationWarning={suppressText}
                            >
                              {t(area.name)}
                            </p>
                            {!isEmpty(selectedArea) &&
                            area.id === selectedArea?.id ? (
                              <CheckCircle className="text-lime-400" />
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
                className="text-primary_BG p-3"
                suppressHydrationWarning={suppressText}
              >
                {t('select_branch')}
              </p>
              <div className={`bg-LightGray p-3`}>
                {map(branches, (b: Branch, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectBranch(b)}
                    className={`flex flex-row  w-full justify-between items-center p-1`}
                  >
                    <label htmlFor={b.name} className="py-1 form-check-label">
                      <p>{b.name}</p>
                    </label>
                    <input
                      className="form-check-input appearance-none rounded-full h-5 w-5 border border-gray-200 focus:ring-lime-400 focus:ring-offset-1 focus:border-2 text-lime-400 focus:border-lime-400 checked:border-lime-400 bg-gray-100 checked:bg-lime-400 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="radio"
                      name="branch"
                      readOnly
                      checked={branch_id === b.id}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => router.replace(`/`)}
            disabled={isNull(branch_id) && isNull(selectedArea.id)}
            className={`${submitBtnClass} mt-12`}
            suppressHydrationWarning={suppressText}
          >
            {t('done')}
          </button>
        </div>
      </Suspense>
    </MainContentLayout>
  );
};

export default SelectMethod;
