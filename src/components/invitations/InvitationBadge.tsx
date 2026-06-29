/**
 * Invitation Status Badge Component
 * Displays color-coded status badges for invitations
 */

import React from 'react';
import { CheckCircle, Clock, XCircle, Ban } from 'lucide-react';
import { clsx } from 'clsx';

interface InvitationBadgeProps {
  status: 'pending' | 'accepted' | 'expired' | 'revoked' | 'declined';
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  expired: {
    label: 'Expired',
    icon: XCircle,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
  },
  revoked: {
    label: 'Revoked',
    icon: Ban,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
  declined: {
    label: 'Declined',
    icon: XCircle,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
};

export function InvitationBadge({ status, className }: InvitationBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
