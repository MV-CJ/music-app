"use client";

import { RefObject, useEffect } from "react";

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  loading: boolean;
  currentPage: number;
  onLoadMore: (
    page: number
  ) => void;
  onToggleButton: (
    visible: boolean
  ) => void;
};

export function useInfiniteScroll({
  containerRef,
  hasMore,
  loading,
  currentPage,
  onLoadMore,
  onToggleButton,
}: Props) {

  useEffect(() => {

    const container =
      containerRef.current;

    if (!container) return;

    const handleScroll = () => {

      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = container;

      onToggleButton(
        scrollTop > 1200
      );

      const nearBottom =
        scrollTop +
        clientHeight >=
        scrollHeight - 800;

      if (
        nearBottom &&
        hasMore &&
        !loading
      ) {

        onLoadMore(
          currentPage + 1
        );
      }
    };

    container.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {

      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, [
    containerRef,
    hasMore,
    loading,
    currentPage,
    onLoadMore,
    onToggleButton,
  ]);
}