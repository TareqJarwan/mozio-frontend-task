// Packages
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Types
import { IDistanceRes } from "@/types/distance.type";
import { ApiError } from "@/types/common.type";

/**
 * calculate distance hook
 * @returns loading indicator and distances data
 */
export const useCalculateDistance = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [distancesData, setDistancesData] = useState<IDistanceRes>();
  const [errors, setErrors] = useState<ApiError>({});
  const { query } = useRouter();

  useEffect(() => {
    setIsLoading(true);
    setErrors({});
    axios
      .get("/api/distance", { params: query })
      .then(({ data }: { data: IDistanceRes }) => {
        setErrors({});
        setIsLoading(false);
        setDistancesData(data);
      })
      .catch(({ response }) => {
        setIsLoading(false);
        setErrors(response.data);
      });
  }, [query]);

  return {
    errors,
    isLoading,
    distances: distancesData,
  };
};
