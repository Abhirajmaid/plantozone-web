import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/src/lib/server/orderConfirmationEmail";

export async function POST(request) {
  try {
    const body = await request.json();

    const order = {
      orderId: body.orderId,
      paymentId: body.paymentId,
      userName: body.userName,
      userLastName: body.userLastName || body.lastName,
      userEmail: body.userEmail,
      userPhone: body.userPhone,
      address: body.address,
      address2: body.address2,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      items: body.items || [],
      subtotal: body.subtotal,
      discountCode: body.discountCode,
      discountAmount: body.discountAmount,
      total: body.total,
      status: body.status || "paid",
    };

    if (!order.orderId || !order.userEmail) {
      return NextResponse.json(
        { error: "orderId and userEmail are required" },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail(order);

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent",
      provider: result.provider,
    });
  } catch (err) {
    console.error("Order confirmation email error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}
