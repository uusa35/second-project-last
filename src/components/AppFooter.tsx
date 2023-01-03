import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { appLinks, suppressText } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { isAuthenticated, isVerified } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';
const AppFooter: FC = (): JSX.Element => {
  const { country } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const isAuth = useAppSelector(isAuthenticated);
  const verified = useAppSelector(isVerified);
  const router = useRouter();

  const handleGoHome = () => {
    router.push(`/`, ``, {
      scroll: false,
    });
  };

  return (
    <footer
      className={`relative left-0 bottom-0 bg-gray-50 py-4 w-full lg:w-2/4 xl:w-1/3`}
    >
      <div className="flex justify-center lg:justify-start px-8 items-center ">
        <p className={`text-stone-400`}>powered by .....</p>
      </div>
    </footer>
  );
};

export default AppFooter;
