import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { branchApi } from '@/redux/api/branchApi';
import MainHead from '@/components/MainHead';
import { Branch } from '@/types/queries';
import { map } from 'lodash';
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hooks';
import { setBranch } from '@/redux/slices/branchSlice';

type Props = {
  elements: Branch[];
};
const BranchIndex: NextPage<Props> = ({ elements }) => {
<<<<<<< HEAD
=======
  console.log('elements', elements);
>>>>>>> Esraa
  const dispatch = useAppDispatch();
  return (
    <>
      <MainHead title={`branchIndex`} description={`branchIndex`} />
      <MainContentLayout>
        <h1>Branch Index</h1>
        <ul>
          {map(elements, (b, i) => (
            <Link href={`#`} onClick={() => dispatch(setBranch(b))} key={i}>
              {b.name}
            </Link>
          ))}
        </ul>
      </MainContentLayout>
    </>
  );
};

export default BranchIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      const { data: elements, isError } = await store.dispatch(
        branchApi.endpoints.getBranches.initiate({ lang: locale })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !elements.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          elements: elements.Data,
        },
      };
    }
);
