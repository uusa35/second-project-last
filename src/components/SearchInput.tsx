import { FC } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { arboriaFont, suppressText } from '../constants';
import { useTranslation } from 'react-i18next';
import { startCase } from 'lodash';
import { useRouter } from 'next/router';

type Props = {
  onFocus?: () => void;
  onChange?: any;
  placeholder?: string;
  defaultValue?: string;
};

const SearchInput: FC<Props> = ({
  onFocus,
  onChange,
  placeholder = '',
  defaultValue = '',
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6">
        <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
      </div>
      <input
        type="search"
        name="search"
        id="search"
        defaultValue={defaultValue}
        onFocus={onFocus}
        onChange={onChange}
        className={`block w-full focus:ring-1 focus:ring-primary_BG rounded-md  pl-20 border-none  bg-gray-100 py-3 h-12  text-lg capitalize ${arboriaFont}`}
        suppressHydrationWarning={suppressText}
        placeholder={
          placeholder ? placeholder : `${startCase(`${t(`search`)}`)}`
        }
      />
    </div>
  );
};

export default SearchInput;
