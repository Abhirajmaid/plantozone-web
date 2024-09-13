import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <Leaf className="mx-auto h-12 w-full text-green-500" />
          <h1 className="text-6xl font-bold text-gray-900">
            404 - Page Not Found
          </h1>
          <p className="text-base text-gray-600">
            Oops! It looks like this page has gone dormant. Let's get you back
            to greener pastures.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Here are some helpful links:</p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Browse Our Plants</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/care-guides">Plant Care Guides</Link>
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          If you believe this is a mistake, please{" "}
          <Link href="/contact" className="text-green-600 hover:underline">
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
