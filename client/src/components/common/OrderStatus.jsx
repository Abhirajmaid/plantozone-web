"use client";
import React from "react";
import { Check, Package, CheckCircle, Loader, Truck, Home } from "lucide-react";

const defaultSteps = [
  {
    id: 1,
    label: "Order Placed",
    icon: Package,
    completed: true,
    date: "20 Oct 2024",
    time: "11:00 AM"
  },
  {
    id: 2,
    label: "Accepted",
    icon: CheckCircle,
    completed: true,
    date: "20 Oct 2024",
    time: "11:15 AM"
  },
  {
    id: 3,
    label: "In Progress",
    icon: Loader,
    completed: false,
    date: "Expected",
    time: "21 Oct 2024"
  },
  {
    id: 4,
    label: "On the Way",
    icon: Truck,
    completed: false,
    date: "Expected",
    time: "22,23 Oct 2024"
  },
  {
    id: 5,
    label: "Delivered",
    icon: Home,
    completed: false,
    date: "Expected",
    time: "24 Oct 2024"
  }
];

const OrderStatus = ({ orderData }) => {
  // Use provided steps if available, otherwise fall back to defaults
  const steps = (orderData && Array.isArray(orderData.steps) && orderData.steps.length) ? orderData.steps : defaultSteps;

  // Determine how far the progress bar should go based on completed steps
  // Find index of first not completed step
  const firstIncompleteIndex = steps.findIndex(step => !step.completed);
  const progressToIndex = firstIncompleteIndex === -1 ? steps.length - 1 : firstIncompleteIndex - 1;

  const progressPercentage = progressToIndex >= 0 && steps.length > 1
    ? (progressToIndex / (steps.length - 1)) * 100 + (1 / (steps.length - 1)) * 100 / 2
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Status</h2>
      <p className="text-gray-600 mb-8">Order ID : {orderData?.orderId || "#SDGT1254FD"}</p>

      {/* Progress Steps */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

        {/* Progress Line - Green line that reaches the center of completed icons */}
        <div
          className="absolute top-6 left-0 h-0.5 bg-green-600 z-0 transition-all duration-500"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        ></div>

        <div className="flex justify-between items-start relative z-10">
          {steps.map((step) => {
            const IconComponent = step.icon || Package;
            const isStepCompleted = !!step.completed;
            return (
              <div key={step.id} className="flex flex-col items-center relative flex-1">
                {/* Step Icon with White Background */}
                <div className="relative flex-shrink-0 mb-3">
                  <div className={`relative z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border-2 ${isStepCompleted ? 'border-green-600' : 'border-gray-200'}`}>
                    <IconComponent
                      className={`w-6 h-6 ${isStepCompleted ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  </div>
                </div>

                {/* Step Name */}
                <div className="text-center mb-2">
                  <h3 className={`font-semibold text-sm ${
                    isStepCompleted
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h3>
                </div>

                {/* Status Indicator */}
                <div className={`${isStepCompleted ? 'bg-green-600' : 'bg-gray-300'} w-6 h-6 rounded-full flex items-center justify-center mb-2`}>
                  {isStepCompleted ? <Check className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-white/60" />}
                </div>

                {/* Date/Time */}
                <div className="text-center">
                  <div className={`text-xs ${
                    isStepCompleted
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}>
                    {step.date}
                  </div>
                  <div className={`text-xs ${
                    isStepCompleted
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}>
                    {step.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;

