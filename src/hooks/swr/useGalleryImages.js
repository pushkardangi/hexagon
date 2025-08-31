import useSWRInfinite from "swr/infinite";
import { getSavedImagesApi } from "../../api";

const fetcher = async (page) => {
  const res = await getSavedImagesApi(page);
  if (res.error) throw res.error;
  return res.data;
};

export const useGalleryImages = () => {
  const { data, error, isLoading, size: page, setSize: setPage, mutate: mutateGallery } = useSWRInfinite(
    (index) => ["images", index + 1],
    ([, page]) => fetcher(page),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
    }
  );

  // Flatten paginated results
  const images = data ? data.flatMap((page) => page.images || []) : [];
  const totalImages = data?.[0]?.totalImages || 0;
  const hasMoreImages = data?.[data.length - 1]?.hasMoreImages ?? true;

  return {
    images,
    totalImages,
    hasMoreImages,
    error,
    isLoading,
    page,
    setPage,
    mutateGallery,
  };
};
