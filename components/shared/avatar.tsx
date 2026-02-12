import Image from 'next/image';
import { User2 } from 'lucide-react';

const joinClassNames = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(' ');

type Props = {
  avatarUrl?: string;
  name?: string;
  size: number;
  className?: string;
  imageClassName?: string;
  backgroundColor?: string;
  fallbackInitials?: string;
  fallbackTextClassName?: string;
  fallbackIconClassName?: string;
};

export default function Avatar({
  avatarUrl,
  name,
  size,
  className,
  imageClassName,
  backgroundColor,
  fallbackInitials,
  fallbackTextClassName,
  fallbackIconClassName,
}: Props) {
  const wrapperClassName = joinClassNames(
    'relative flex items-center justify-center overflow-hidden rounded-full',
    className,
  );

  return (
    <div
      className={wrapperClassName}
      style={{ width: size, height: size, backgroundColor }}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name || 'User avatar'}
          fill
          sizes={`${size}px`}
          className={joinClassNames('object-cover', imageClassName)}
        />
      ) : fallbackInitials ? (
        <span className={fallbackTextClassName}>{fallbackInitials}</span>
      ) : (
        <User2 className={fallbackIconClassName || 'h-4 w-4 text-white'} />
      )}
    </div>
  );
}
