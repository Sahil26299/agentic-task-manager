import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center gap-4 text-2xl">
      <Spinner className="text-2xl" />
      <p className="text-gray-500 animate-pulse font-bold" > Loading Dashboard...</p>
    </div>
  );
}
