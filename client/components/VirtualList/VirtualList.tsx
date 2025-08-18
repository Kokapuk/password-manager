import { DetailedHTMLProps, HTMLAttributes, ReactNode, useMemo, useState } from 'react';

interface Props {
  children: ReactNode[];
  itemHeight: number;
  gap: number;
}

const VirtualList = ({
  children,
  itemHeight,
  gap,
  onScroll,
  style,
  ...props
}: Props & Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'children'>) => {
  const [topSkipChildren, setTopSkipChildren] = useState(0);
  const [topPlaceholderHeight, setTopPlaceholderHeight] = useState(0);
  const [bottomSkipChildren, setBottomSkipChildren] = useState(0);
  const [bottomPlaceholderHeight, setBottomPlaceholderHeight] = useState(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(event);

    let newTopSkipChildren = 0;
    let topChildrenHeight = 0;

    while (true) {
      const newTopChildrenHeight = topChildrenHeight + itemHeight + gap;

      if (newTopChildrenHeight < event.currentTarget.scrollTop) {
        topChildrenHeight = newTopChildrenHeight;
        newTopSkipChildren++;
      } else {
        setTopSkipChildren(newTopSkipChildren);
        setTopPlaceholderHeight(Math.max(topChildrenHeight - gap, 0));
        break;
      }
    }

    let newBottomSkipChildren = 0;
    let bottomChildrenHeight = 0;
    const scrollBottom =
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight - event.currentTarget.scrollTop;

    while (true) {
      const newBottomChildrenHeight = bottomChildrenHeight + itemHeight + gap;

      if (newBottomChildrenHeight < scrollBottom) {
        bottomChildrenHeight = newBottomChildrenHeight;
        newBottomSkipChildren++;
      } else {
        setBottomSkipChildren(newBottomSkipChildren);
        setBottomPlaceholderHeight(Math.max(bottomChildrenHeight - gap, 0));
        break;
      }
    }
  };

  return (
    <div {...props} style={{ ...style, gap, overflowAnchor: 'none' }} onScroll={handleScroll}>
      <div style={{ height: topPlaceholderHeight, flexShrink: 0 }}></div>
      {children.slice(topSkipChildren, children.length - bottomSkipChildren)}
      <div style={{ height: bottomPlaceholderHeight, flexShrink: 0 }}></div>
    </div>
  );
};

export default VirtualList;
