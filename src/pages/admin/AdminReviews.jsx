import AnimatedSection from '../../components/animations/AnimatedSection';

export default function AdminReviews() {
  return (
    <div>
      <AnimatedSection className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Manage Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Review moderation and management</p>
      </AnimatedSection>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm">
        <p className="text-gray-400">Review management interface. Reviews are managed through the API and recipe detail pages.</p>
      </div>
    </div>
  );
}
