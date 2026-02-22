'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { INDIAN_STATES } from '@/lib/constants';

interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AddressForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save Address',
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          {...register('fullName', { required: 'Full name is required' })}
          error={errors.fullName?.message}
        />
        <Input
          label="Phone Number"
          type="tel"
          {...register('phone', {
            required: 'Phone number is required',
            pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone number' },
          })}
          error={errors.phone?.message}
        />
      </div>

      <Input
        label="Address Line 1"
        {...register('addressLine1', { required: 'Address is required' })}
        error={errors.addressLine1?.message}
      />
      <Input
        label="Address Line 2 (Optional)"
        {...register('addressLine2')}
        error={errors.addressLine2?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="City"
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />
        <div>
          <label className="block text-sm font-medium mb-1.5">State</label>
          <select
            {...register('state', { required: 'State is required' })}
            className="w-full px-3 py-2.5 text-sm border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
          )}
        </div>
        <Input
          label="Pincode"
          {...register('pincode', {
            required: 'Pincode is required',
            pattern: { value: /^\d{6}$/, message: 'Invalid pincode' },
          })}
          error={errors.pincode?.message}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register('isDefault')}
          className="rounded border-border"
        />
        <span className="text-sm">Set as default address</span>
      </label>

      <Button type="submit" isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
