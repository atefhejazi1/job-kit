interface AvatarProps {
  name: string | null | any;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

// Helper function to generate avatar initials
const getInitials = (name: string | null) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Helper function to generate avatar color based on name
const getAvatarColor = (name: string | null) => {
  if (!name) return '#ff5c00';
  const colors = [
    '#ff5c00', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899'
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function Avatar({ name, size = 'md', className = '', onClick }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full flex items-center justify-center text-white font-semibold
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
      style={{ backgroundColor: getAvatarColor(name) }}
      onClick={onClick}
      title={name || 'User'}
    >
      {getInitials(name)}
    </div>
  );
}