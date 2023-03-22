import { QueryClient, QueryClientProvider } from "react-query";

export function WithQueryClient({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}