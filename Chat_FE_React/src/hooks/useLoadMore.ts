import { useCallback, useRef } from "react";

export default function useLoadMore(
  items: any[],
  loading: boolean,
  hasMoreItems: boolean,
  setPageNumberMessages: any,
  totalItems = 20,
) {
  const observer: any = useRef();

  const lastElementRef = useCallback(
    (node: any) => {
      // if length items < totalItems not load more
      if (items?.length < totalItems) return;
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreItems) {
          setPageNumberMessages((prevPageNumber: number) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMoreItems],
  );

  return { lastElementRef };
}
