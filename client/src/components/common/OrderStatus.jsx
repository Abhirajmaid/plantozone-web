"use client";
import React from "react";
import { Check, Package, CheckCircle, Loader, Truck, Home } from "lucide-react";

const OrderStatus = ({ orderData }) => {
  const steps = [
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

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = completedSteps > 0 ? ((completedSteps - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Status</h2>
      <p className="text-gray-600 mb-8">Order ID : {orderData?.orderId || "#SDGT1254FD"}</p>
      
      {/* Progress Steps */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
        
        {/* Progress Line */}
        <div 
          className="absolute top-6 left-0 h-0.5 bg-green-600 z-0 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        <div className="flex justify-between items-start relative z-10">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center relative flex-1">
                {/* Step Icon */}
                <div className="relative flex-shrink-0 mb-3">
                  <div className="relative z-10 w-12 h-12 flex items-center justify-center">
                    <IconComponent 
                      className={`w-6 h-6 ${step.completed ? 'text-yellow-600' : 'text-gray-400'}`} 
                    />
                  </div>
                </div>
                
                {/* Step Name */}
                <div className="text-center mb-2">
                  <h3 className={`font-semibold text-sm ${
                    step.completed 
                      ? 'text-gray-900' 
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h3>
                </div>
                
                {/* Status Indicator */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                  step.completed 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}>
                  <Check className="w-4 h-4 text-white" />
                </div>
                
                {/* Date/Time */}
                <div className="text-center">
                  <div className={`text-xs ${
                    step.completed 
                      ? 'text-gray-700' 
                      : 'text-gray-400'
                  }`}>
                    {step.date}
                  </div>
                  <div className={`text-xs ${
                    step.completed 
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

