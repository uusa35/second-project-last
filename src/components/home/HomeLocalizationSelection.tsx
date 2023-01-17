import Select from 'react-select';
import {
  imageSizes,
  langOptions,
  setApiCountry,
  suppressText,
} from '@/constants/*';
import { filter, first, map, random } from 'lodash';
import { useMemo, FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCountry } from '@/redux/slices/countrySlice';
import { Country } from '@/types/queries';
import { setLocale } from '@/redux/slices/localeSlice';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import arImage from '@/appImages/ar.png';
import enImage from '@/appImages/en.png';
import Image from 'next/image';
import { motion } from 'framer-motion';
import * as queryString from 'querystring';
import { showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  countries: Country[];
};

const HomeLocalizationSelection: FC<Props> = ({ countries }): JSX.Element => {
  const {
    locale: { isRTL, label },
    country,
  } = useAppSelector((state) => state);
  const [optionCountries, setOptionCountries] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await router
        .push(router.pathname, router.asPath, {
          locale,
          scroll: false,
        })
        .then(() =>
          dispatch(
            showToastMessage({
              content: `language_changed_successfully`,
              type: `info`,
            })
          )
        )
        .then(() => dispatch(setLocale(locale)));
    }
  };

  const handleSelectCountry = async (id: number) => {
    if (countries && country.id !== id) {
      const currentCountry: any = first(
        filter(countries, (c: any) => c.id === id)
      );
      await dispatch(setCountry(currentCountry));
      await router
        .replace(`/`, ``, {
          scroll: false,
        })
        .then(() =>
          dispatch(
            showToastMessage({
              content: `country_changed_successfully`,
              type: `info`,
            })
          )
        );
    }
  };

  useMemo(() => {
    if (countries) {
      const reformatedCountries = map(countries, (c: Country) => {
        return {
          id: c.id,
          value: c.id,
          label: isRTL ? c.name_ar : c.name_en,
          image: c.image,
        };
      });
      setOptionCountries(reformatedCountries);
    }
    setSelectedLanguage(
      first(filter(langOptions, (o) => o.value === router.locale))
    );
  }, []);

  useMemo(() => {
    setSelectedCountry({
      id: country.id,
      value: country.id,
      label: isRTL ? country.name_ar : country.name_en,
    });
  }, [country]);

  return (
    <motion.div className="grid grid-cols-2 gap-x-5 gap-y-6  py-0 text-center">
      {/* select language */}
      <Select
        isSearchable={false}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            color: `white`,
            height: '100%',
            padding: 0,
            backgroundColor: '#141E3C !important',
          }),
          container: (baseStyles) => ({
            ...baseStyles,
            // minHeight: '60px',
          }),
        }}
        components={{
          IndicatorSeparator: () => null,
        }}
        instanceId={random(9, 88)}
        className="react-select-container"
        classNamePrefix="react-select"
        options={langOptions}
        onChange={(e: any) => handleChangeLang(e.value)}
        defaultValue={selectedLanguage}
        isRtl={isRTL}
        placeholder={t(label)}
        formatOptionLabel={(option) => (
          <div className={`flex flex-1 justify-center items-center`}>
            <Image
              src={option.value === 'ar' ? arImage : enImage}
              alt={option.label}
              width={imageSizes.xs}
              height={imageSizes.xs}
              className={`w-4 h-4 rounded-full object-cover`}
            />
            <span className={`rtl:mr-3 ltr:ml-3 pt-1`}>{option.label}</span>
          </div>
        )}
      />
      {/* select country */}
      <Select
        isSearchable={false}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            color: `white`,
            height: '100%',
            padding: 0,
            backgroundColor: '#141E3C !important',
          }),
          container: (baseStyles) => ({
            ...baseStyles,
            // minHeight: '60px',
          }),
        }}
        components={{
          IndicatorSeparator: () => null,
        }}
        instanceId={random(99, 99)}
        className="react-select-container"
        classNamePrefix="react-select"
        options={optionCountries}
        onChange={(e: any) => handleSelectCountry(e.value)}
        defaultValue={selectedCountry}
        isRtl={isRTL}
        placeholder={t(country.name)}
        formatOptionLabel={(option) => (
          <div className={`flex flex-1 justify-center items-center`}>
            <Image
              src={option.image ?? arImage}
              alt={option.label}
              width={imageSizes.xs}
              height={imageSizes.xs}
              className={`w-4 h-4 rounded-full object-cover`}
            />
            <span className={`rtl:mr-3 ltr:ml-3 pt-1`}>{option.label}</span>
          </div>
        )}
      />
    </motion.div>
  );
};
export default HomeLocalizationSelection;
