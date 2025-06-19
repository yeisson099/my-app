import { SkeletonLoaderTable } from "@components";
import { Suspense } from "react";
import AdvisorsListPage from "./AdvisorsListPage";


export default function AdvisorsPage() {
  return (
    <Suspense fallback={<SkeletonLoaderTable />}>
      <AdvisorsListPage />
    </Suspense>
  );
}
