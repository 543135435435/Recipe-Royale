import AnimatedSection from '../../components/animations/AnimatedSection';

export default function AdminSettings() {
  return (
    <div>
      <AnimatedSection className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Admin Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Platform configuration</p>
      </AnimatedSection>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-charcoal dark:text-white mb-2">Site Name</h3>
            <input defaultValue="Recipe Royale" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal dark:text-white mb-2">Site Description</h3>
            <textarea defaultValue="Where every recipe tells a story." rows={2} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-gold resize-none" />
          </div>
          <button className="px-6 py-2.5 bg-gold text-white text-sm font-medium rounded-xl hover:bg-gold-dark transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
