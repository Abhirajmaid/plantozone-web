import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";

export const CartDrawer = ({
  isOpen,
  setIsOpen,
  cartItems,
  updateQuantity,
  removeFromCart,
}) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  // Delivery fee logic
  const DELIVERY_FEE = 79;
  const FREE_DELIVERY_THRESHOLD = 2000;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  const total = subtotal + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart</span>
            {cartItems.length > 0 && !isFreeDelivery && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                ₹{FREE_DELIVERY_THRESHOLD - subtotal} for FREE delivery
              </span>
            )}
            {cartItems.length > 0 && isFreeDelivery && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                🎉 FREE Delivery!
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className=" h-auto flex flex-col mt-[100px]">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <img
                src="/api/placeholder/200/200"
                alt="Empty cart"
                className="w-32 h-32 opacity-50"
              />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.title}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-medium">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-auto">
                {/* Free Delivery Progress */}
                {!isFreeDelivery && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-800">
                        🚚 Free Delivery Progress
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        ₹{FREE_DELIVERY_THRESHOLD - subtotal} to go!
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (subtotal / FREE_DELIVERY_THRESHOLD) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-700">
                      Save ₹{DELIVERY_FEE} on delivery! 🌱
                    </p>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span>Delivery</span>
                      {isFreeDelivery && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          FREE
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        isFreeDelivery
                          ? "text-green-700 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {isFreeDelivery ? `₹${DELIVERY_FEE}` : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {isFreeDelivery && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                      🎉 Free delivery on orders above ₹2000
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
