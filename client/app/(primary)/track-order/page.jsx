import React, { Suspense } from "react";
import TrackOrderClient from "./TrackOrderClient";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8">Loading...</div>}>
      <TrackOrderClient />
    </Suspense>
  );
}
