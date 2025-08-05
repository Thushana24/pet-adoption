import { useApi } from "@/providers/ApiProvider";
import { User } from "@prisma/client";
import { RegisterInput } from "@/app/api/auth/types";
import { useCreateMutation } from "../apiFactory";

export const useRegister = ({
  invalidateQueryKey,
}: {
  invalidateQueryKey?: unknown[];
}) => {
  const { jsonApiClient } = useApi();

  return useCreateMutation<
    Record<string, any>,
    RegisterInput,
    { data: { user: User; token: string } },
    { data: { user: User; token: string } }
  >({
    apiClient: jsonApiClient,
    method: "post",
    url: "/auth/register",
    errorMessage: "Failed to register.",
    invalidateQueryKey,
    mutationOptions: {},
  });
};
