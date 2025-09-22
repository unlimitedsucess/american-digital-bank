import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import axios from "@/lib/axios";
import { HttpRequestConfigProps } from "@/types/global";
import { tokenActions } from "@/store/token/token-slice";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const sendHttpRequest = useCallback(
    async ({
      successRes,
      errorRes,
      requestConfig,
    }: HttpRequestConfigProps & { errorRes?: (err: any) => void }) => {
      setError(null);

      if (!requestConfig.token && requestConfig.isAuth) {
        dispatch(tokenActions.deleteToken());

        if (requestConfig.userType === "customer") {
          router.replace("/login");
        } else {
          router.replace("/adminlogin");
        }

        setError("Please login!");
        toast.error("Please login!");
        return;
      }

      setLoading(true);

      try {
        const isFormData = requestConfig.body instanceof FormData;

        const config = {
          url: requestConfig.url,
          method: requestConfig.method,
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(requestConfig.token && {
              Authorization: `Bearer ${requestConfig.token}`,
            }),
          },
          ...(requestConfig.params && { params: requestConfig.params }),
          ...(requestConfig.body && { data: requestConfig.body }),
          validateStatus: (status: number) => status >= 200 && status < 300,
        };

        console.log("Axios Base URL:", axios.defaults.baseURL);
        console.log("Final Axios Request Config:", config);
        console.log(
          "Full URL:",
          `${axios.defaults.baseURL?.replace(/\/$/, "")}${config.url}`
        );

        const res = await axios.request(config);

        if (res.status >= 200 && res.status < 300) {
          if (requestConfig.successMessage) {
            toast.success(requestConfig.successMessage);
          }
          successRes(res);
        }
      } catch (error: any) {
        let errorMessage: string = "Something went wrong. Please try again.";

        if (error.code === "ERR_NETWORK") {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error?.response?.data) {
          const data = error.response.data;

          if (typeof data === "object") {
            if (data.description) {
              errorMessage = data.description;
            } else {
              const firstKey = Object.keys(data)[0];
              const firstValue = data[firstKey];
              if (Array.isArray(firstValue)) {
                errorMessage = firstValue[0];
              } else if (typeof firstValue === "string") {
                errorMessage = firstValue;
              }
            }
          }
        }

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          errorMessage = "Please login!";
          dispatch(tokenActions.deleteToken());

          const userType = requestConfig.userType ?? "customer";
          if (userType === "customer") {
            router.replace("/login");
          } else {
            router.replace("/adminlogin");
          }
        }
        console.error("HTTP Request Error:", error);
        console.error("Parsed Error Message:", errorMessage);

        // 🔹 Pass error back to the component
        if (errorRes) {
          errorRes(error);
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [router, dispatch]
  );

  return {
    loading,
    sendHttpRequest,
    error,
    setError,
  };
};
