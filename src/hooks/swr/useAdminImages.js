import useSWRInfinite from "swr/infinite";
import { fetchAdminImages } from "../../api";

const PAGE_SIZE = 50;

export const useAdminGalleryImages = ({ status, prompt, sort }) => {
  console.log("useAdminGalleryImages params:", { status, prompt, sort });
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.pagination && !previousPageData.pagination.hasMore) return null;

    return {
      page: pageIndex + 1,
      limit: PAGE_SIZE,
      ...(status && { status }),
      ...(prompt && { prompt }),
      ...(sort && { sort }),
    };
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetchAdminImages, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    revalidateFirstPage: false, // NOTE
    dedupingInterval: 5000,
    shouldRetryOnError: (err) => err?.response?.status !== 401,
  });

  const pages = Array.isArray(data) ? data.filter(Boolean) : [];
  const images = pages.flatMap((p) => p?.images ?? []);
  const lastPage = pages[pages.length - 1];
  const hasMore = !!lastPage?.pagination?.hasMore;

  const fetchNextPage = () => setSize(size + 1);

  return {
    images,
    isLoading: !data && !error,
    isError: error,
    hasMore,
    fetchNextPage,
    isValidating,
  };
};
