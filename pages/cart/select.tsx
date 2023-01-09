import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetLocationsQuery } from '@/redux/api/locationApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { AppQueryResult, Area, Branch } from '@/types/queries';
import { useEffect, useState } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
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
import { Cart } from '@/types/index';
import { selectMethod } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { setBranch } from '@/redux/slices/branchSlice';

const SelectMethod: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
    area: selectedArea,
    cart: { method },
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

  const handleSelectMethod = (m: Cart['method']) => dispatch(selectMethod(m));

  const handleSelectBranch = (b: Branch) => dispatch(setBranch(b));

  // const changetoPickupMethod = () => {
  //   if (method === 'delivery') {
  //     handleSelectMethod('pickup');
  //   } else {
  //     return;
  //   }
  // };
  // const changetoDeliveryMethod = () => {
  //   if (method === 'pickup') {
  //     handleSelectMethod('delivery');
  //   } else {
  //     return;
  //   }
  // };

  return (
    <MainContentLayout>
      <div className={`px-4`}>
        <div className="flex flex-1 w-full flex-col md:flex-row justify-between items-center mb-3">
          <button
            className={`${
              method === 'delivery' ? `${submitBtnClass}` : `${normalBtnClass}`
            } md:ltr:mr-3 md:rtl:ml-3`}
            suppressHydrationWarning={suppressText}
            onClick={() => handleSelectMethod(`delivery`)}
          >
            {t('delivery')}
          </button>
          <button
            className={`${
              method === 'pickup' ? `${submitBtnClass}` : `${normalBtnClass}`
            } md:ltr:mr-3 md:rtl:ml-3`}
            suppressHydrationWarning={suppressText}
            onClick={() => handleSelectMethod(`pickup`)}
          >
            {t('pickup')}
          </button>
        </div>
        <div className={`mb-5 py-1 ${inputFieldClass} flex items-center`}>
          <Image
            src={SearchIcon}
            alt={`${t('search')}`}
            suppressHydrationWarning={suppressText}
          />
          <input
            type="text"
            placeholder={`${t('search')}`}
            className={`m-0 py-0 pt-1 ${inputFieldClass} border-0`}
            suppressHydrationWarning={suppressText}
          ></input>
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
                    className="form-check-input appearance-none rounded-full h-5 w-5 border border-gray-200 checked:border-lime-400 bg-white checked:bg-lime-400 checked:border-lime-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
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
          disabled={isNull(branch_id) || isNull(selectedArea.id)}
          className={`${submitBtnClass} mt-12`}
          suppressHydrationWarning={suppressText}
        >
          {t('done')}
        </button>
      </div>
    </MainContentLayout>
  );
};

export default SelectMethod;
