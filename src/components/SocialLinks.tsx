import React from 'react';
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from 'react-icons/fa';

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const socialMediaLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/uttarakhand_rugby?utm_source=qr',
    ariaLabel: 'Follow Uttarakhand Rugby Association on Instagram (opens in a new tab)',
    icon: FaInstagram,
    hoverClasses: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-lg hover:shadow-pink-900/40',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1D1aaoKXs1/?mibextid=wwXIfr',
    ariaLabel: 'Connect with Uttarakhand Rugby Association on Facebook (opens in a new tab)',
    icon: FaFacebookF,
    hoverClasses: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-lg hover:shadow-blue-900/40',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@uttarakhandrugbyassociation?si=ap0v3e-hntlhNLZP',
    ariaLabel: 'Subscribe to Uttarakhand Rugby Association on YouTube (opens in a new tab)',
    icon: FaYoutube,
    hoverClasses: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:shadow-lg hover:shadow-red-900/40',
  },
];

export default function SocialLinks({ className = 'flex items-center space-x-3', size = 'md' }: SocialLinksProps) {
  const sizeClasses = 
    size === 'sm' 
      ? 'w-9 h-9' 
      : size === 'lg' 
      ? 'w-11 h-11' 
      : 'w-10 h-10';

  const iconSizes = 
    size === 'sm' 
      ? 'w-4 h-4' 
      : size === 'lg' 
      ? 'w-5 h-5' 
      : 'w-4 h-4';

  return (
    <div className={className}>
      {socialMediaLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
            className={`${sizeClasses} rounded-xl bg-white border border-[#E1E8E3] flex items-center justify-center text-[#17211D] shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008F65] focus-visible:ring-offset-2 focus-visible:ring-offset-white shrink-0 ${social.hoverClasses}`}
          >
            <Icon className={`${iconSizes} transition-transform duration-300`} />
          </a>
        );
      })}
    </div>
  );
}
