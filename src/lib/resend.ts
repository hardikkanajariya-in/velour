import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'VELOUR <orders@velour.in>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  orderDetails: {
    items: Array<{ name: string; size: string; color: string; qty: number; price: number; image: string }>;
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    address: string;
    estimatedDelivery: string;
  }
) {
  const itemsHtml = orderDetails.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" width="60" height="80" style="object-fit:cover;border-radius:4px;" />
        </td>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <strong>${item.name}</strong><br/>
          <span style="color:#6B6B6B;">${item.size} / ${item.color} × ${item.qty}</span>
        </td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'DM Sans',Arial,sans-serif;color:#1A1A1A;">
      <div style="background:#1A1A1A;padding:24px;text-align:center;">
        <h1 style="color:#C4A882;font-family:'Playfair Display',serif;font-size:28px;margin:0;">VELOUR</h1>
      </div>
      <div style="padding:32px 24px;">
        <h2 style="font-size:24px;margin:0 0 8px;">Order Confirmed!</h2>
        <p style="color:#6B6B6B;margin:0 0 24px;">Thank you for your order. Here are the details:</p>
        <p style="background:#F2EDE8;padding:12px;border-radius:8px;font-family:monospace;font-size:16px;text-align:center;">
          ${orderNumber}
        </p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          ${itemsHtml}
        </table>
        <table style="width:100%;margin:16px 0;">
          <tr><td style="padding:4px 0;color:#6B6B6B;">Subtotal</td><td style="text-align:right;">₹${orderDetails.subtotal.toLocaleString('en-IN')}</td></tr>
          ${orderDetails.discount > 0 ? `<tr><td style="padding:4px 0;color:#16A34A;">Discount</td><td style="text-align:right;color:#16A34A;">-₹${orderDetails.discount.toLocaleString('en-IN')}</td></tr>` : ''}
          <tr><td style="padding:4px 0;color:#6B6B6B;">Shipping</td><td style="text-align:right;">${orderDetails.shipping === 0 ? 'FREE' : '₹' + orderDetails.shipping.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding:4px 0;color:#6B6B6B;">Tax (GST)</td><td style="text-align:right;">₹${orderDetails.tax.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding:12px 0 4px;font-weight:700;font-size:18px;border-top:2px solid #1A1A1A;">Total</td><td style="text-align:right;font-weight:700;font-size:18px;border-top:2px solid #1A1A1A;">₹${orderDetails.total.toLocaleString('en-IN')}</td></tr>
        </table>
        <p style="color:#6B6B6B;margin:24px 0 8px;">Estimated Delivery: <strong>${orderDetails.estimatedDelivery}</strong></p>
        <p style="color:#6B6B6B;margin:0 0 24px;">Shipping to: ${orderDetails.address}</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" style="display:block;text-align:center;background:#1A1A1A;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Track Order</a>
      </div>
      <div style="background:#F2EDE8;padding:16px;text-align:center;color:#6B6B6B;font-size:12px;">
        <p>VELOUR — Wear the Story</p>
        <p>Crafted by <a href="https://hardikkanajariya.in" style="color:#C4A882;">hardikkanajariya.in</a></p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Order Confirmed — ${orderNumber}`,
    html,
  });
}

export async function sendOrderShipped(
  to: string,
  orderNumber: string,
  trackingNumber: string,
  trackingUrl: string,
  estimatedDelivery: string
) {
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'DM Sans',Arial,sans-serif;color:#1A1A1A;">
      <div style="background:#1A1A1A;padding:24px;text-align:center;">
        <h1 style="color:#C4A882;font-family:'Playfair Display',serif;font-size:28px;margin:0;">VELOUR</h1>
      </div>
      <div style="padding:32px 24px;text-align:center;">
        <h2 style="font-size:24px;margin:0 0 16px;">Your Order Has Been Shipped!</h2>
        <p style="color:#6B6B6B;">Order: <strong>${orderNumber}</strong></p>
        <p style="color:#6B6B6B;">Tracking Number: <strong>${trackingNumber}</strong></p>
        <p style="color:#6B6B6B;">Estimated Delivery: <strong>${estimatedDelivery}</strong></p>
        <a href="${trackingUrl}" style="display:inline-block;margin:24px 0;background:#1A1A1A;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Track Package</a>
      </div>
      <div style="background:#F2EDE8;padding:16px;text-align:center;color:#6B6B6B;font-size:12px;">
        <p>Crafted by <a href="https://hardikkanajariya.in" style="color:#C4A882;">hardikkanajariya.in</a></p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject: `Order Shipped — ${orderNumber}`, html });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'DM Sans',Arial,sans-serif;color:#1A1A1A;">
      <div style="background:#1A1A1A;padding:24px;text-align:center;">
        <h1 style="color:#C4A882;font-family:'Playfair Display',serif;font-size:28px;margin:0;">VELOUR</h1>
      </div>
      <div style="padding:32px 24px;text-align:center;">
        <h2 style="font-size:24px;margin:0 0 16px;">Welcome to VELOUR, ${name}!</h2>
        <p style="color:#6B6B6B;margin:0 0 24px;">We're thrilled to have you. Use code <strong>WELCOME10</strong> for 10% off your first order.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/products" style="display:inline-block;background:#1A1A1A;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Shop Now</a>
      </div>
      <div style="background:#F2EDE8;padding:16px;text-align:center;color:#6B6B6B;font-size:12px;">
        <p>Crafted by <a href="https://hardikkanajariya.in" style="color:#C4A882;">hardikkanajariya.in</a></p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject: 'Welcome to VELOUR — Wear the Story', html });
}
