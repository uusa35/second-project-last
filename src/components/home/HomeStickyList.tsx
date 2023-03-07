import { StickyContainer, Sticky } from 'react-sticky';
import { Product } from '@/types/index';

type Props = {
  title: string;
  elements: Product[];
};
const HomeStickyList = ({ title, elements }) => {
  return (
    <StickyContainer>
      {/* Other elements can be in between `StickyContainer` and `Sticky`,
        but certain styles can break the positioning logic used. */}
      <Sticky>
        {({
          style,
          // the following are also available but unused in this example
          isSticky,
          wasSticky,
          distanceFromTop,
          distanceFromBottom,
          calculatedHeight,
        }) => (
          <header style={style} className={`relative mt-[90px]`}>
            <h1 className={`bg-blue-400 relative`}>{title}</h1>
          </header>
        )}
      </Sticky>
      <div className={``}> content testing </div>
    </StickyContainer>
  );
};

export default HomeStickyList;
