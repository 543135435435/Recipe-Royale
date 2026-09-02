import { SearchX, Heart, ChefHat, BookOpen } from 'lucide-react';

const icons = {
  search: SearchX,
  favorites: Heart,
  recipes: BookOpen,
  default: ChefHat,
};

export default function EmptyState({ type = 'default', title, description, action }) {
  const Icon = icons[type] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-2">
        {title || 'Nothing here yet'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mb-6">
        {description || 'Start exploring and you\'ll find something amazing.'}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
