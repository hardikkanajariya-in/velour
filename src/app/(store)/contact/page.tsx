'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@velour.in', href: 'mailto:hello@velour.in' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India' },
  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat, 10:00 AM - 7:00 PM IST' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      <div className="text-center max-w-2xl mx-auto py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">Get in Touch</h1>
        <p className="text-muted-foreground">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 sm:mb-16">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <Input
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium mb-1.5">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none min-h-[120px]"
              placeholder="Tell us how we can help..."
            />
          </div>
          <Button type="submit" disabled={sending} className="gap-2 min-h-[44px]">
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6">
          {contactInfo.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{value}</p>
                )}
              </div>
            </div>
          ))}

          {/* FAQ Link */}
          <div className="p-4 sm:p-6 bg-surface rounded-card mt-6 sm:mt-8">
            <h3 className="font-heading font-bold mb-2">Frequently Asked Questions</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Find answers to common questions about orders, shipping, returns, and more.
            </p>
            <a href="/faq" className="text-sm text-accent hover:underline">
              View FAQ →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
