import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetLocationsQuery } from '@/redux/api/locationApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NextPage } from 'next';
import { useGetBranchesQuery } from '@/redux/api/branchApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { AppQueryResult, Area } from '@/types/queries';
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

const SelectMethod: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
    area: selectedArea,
    cart
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { data: locations, isLoading } = useGetLocationsQuery<{
    data: AppQueryResult<Location[]>;
    isLoading: boolean;
  }>({ lang });
  const [open, setOpen] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };
  console.log("the branches", branches)

  useEffect(() => {
    dispatch(setCurrentModule(t('select_method')));
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const Icon = ({ id, open }: any)=> {
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

  return (
    <MainContentLayout>
      <div className="flex flex-1 w-full flex-col md:flex-row justify-between items-center my-2">
          <button
            className={`${normalBtnClass}  md:ltr:mr-3 md:rtl:ml-3 ${cart.method === 'delivery' && 'bg-primary_BG'}`}
            suppressHydrationWarning={suppressText}
          >
            {t('delivery')}
          </button>
          <button
            className={`${normalBtnClass} md:ltr:mr-3 md:rtl:ml-3 ${cart.method === 'pickup' && 'bg-primary_BG'}`}
            suppressHydrationWarning={suppressText}
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
     {cart.method === 'delivery' &&  <div className={`px-4`}>
     {locations.Data.map((item) => {
          return (
            <Accordion
              key={item.id}
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
                      className={'flex justify-between w-full p-4'}
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
      }
      {cart.method === 'pickup' && <div className='px-4'>
      <p  className='text-primary_BG'>{t('choose_store')}</p>
      {branches.map((branch: any)=><div >
        <label htmlFor={branch.id} className='flex justify-between items-center py-1 form-check-label'>
          <p>{branch.name}</p>
        <input className='form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer' type='radio' name='branch' id={branch.id} value={branch.id} /></label>
      </div>)}
      </div>}
      <button className={`${submitBtnClass} mt-15`} suppressHydrationWarning={suppressText}>
        {t('done')}
      </button>
    </MainContentLayout>
  );
};

export default SelectMethod;
