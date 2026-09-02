import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, GripVertical, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { recipeService, categoryService } from '../services/recipeService';
import { toast } from 'sonner';
import { CUISINES, DIFFICULTIES } from '../constants';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '', optional: false }]);
  const [instructions, setInstructions] = useState([{ title: '', description: '', timer: 0 }]);
  const [tags, setTags] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const coverImage = watch('coverImage');

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '', unit: '', optional: false }]);
  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i, field, value) => {
    const updated = [...ingredients];
    updated[i] = { ...updated[i], [field]: value };
    setIngredients(updated);
  };

  const addInstruction = () => setInstructions([...instructions, { title: '', description: '', timer: 0 }]);
  const removeInstruction = (i) => setInstructions(instructions.filter((_, idx) => idx !== i));
  const updateInstruction = (i, field, value) => {
    const updated = [...instructions];
    updated[i] = { ...updated[i], [field]: value };
    setInstructions(updated);
  };

  const onSubmit = async (data, status = 'published') => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage || '',
        cuisine: data.cuisine,
        categoryId: data.category || undefined,
        difficulty: data.difficulty || 'medium',
        prepTime: Number(data.prepTime) || 0,
        cookTime: Number(data.cookTime) || 0,
        servings: Number(data.servings) || 4,
        ingredients: ingredients.filter((i) => i.name.trim()),
        instructions: instructions.filter((i) => i.description.trim()).map((inst, idx) => ({
          ...inst,
          step: idx + 1,
          timer: Number(inst.timer) || 0,
        })),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
      };
      const res = await recipeService.createRecipe(payload);
      toast.success(status === 'draft' ? 'Draft saved!' : 'Recipe published!');
      navigate(`/recipes/${res.data.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create recipe';
      const details = err.response?.data?.errors;
      if (details && details.length > 0) {
        toast.error(`${msg}: ${details.map((e) => e.message).join(', ')}`);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Basics', 'Ingredients', 'Instructions', 'Review'];

  return (
    <PageTransition>
      <div className="min-h-screen py-10 bg-cream dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-charcoal dark:text-white">Create Recipe</h1>
            <p className="text-gray-500 mt-1">Share your culinary creation with the world</p>
          </AnimatedSection>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <button key={i} onClick={() => setStep(i)} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i <= step ? 'bg-gold text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>{i + 1}</div>
                <span className={`hidden sm:inline text-sm ${i <= step ? 'text-charcoal dark:text-white font-medium' : 'text-gray-400'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-gold' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit((data) => onSubmit(data))} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
            {/* Step 0: Basics */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Field label="Title *" error={errors.title}>
                  <input {...register('title', { required: 'Title is required' })} className={inputClass} placeholder="My Amazing Recipe" />
                </Field>
                <Field label="Description *" error={errors.description}>
                  <textarea {...register('description', { required: 'Description is required' })} className={inputClass + ' resize-none'} rows={3} placeholder="Tell us about this dish..." />
                </Field>
                <Field label="Cover Image URL">
                  <input {...register('coverImage')} className={inputClass} placeholder="https://..." />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Cuisine *">
                    <select {...register('cuisine', { required: true })} className={inputClass}>
                      <option value="">Select cuisine</option>
                      {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Category">
                    <select {...register('category')} className={inputClass}>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Difficulty">
                    <select {...register('difficulty')} className={inputClass}>
                      {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                    </select>
                  </Field>
                  <Field label="Servings">
                    <input type="number" {...register('servings')} className={inputClass} placeholder="4" defaultValue={4} />
                  </Field>
                  <Field label="Prep Time (min)">
                    <input type="number" {...register('prepTime')} className={inputClass} placeholder="15" />
                  </Field>
                  <Field label="Cook Time (min)">
                    <input type="number" {...register('cookTime')} className={inputClass} placeholder="30" />
                  </Field>
                </div>
                <Field label="Tags (comma separated)">
                  <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="pasta, italian, quick" />
                </Field>
              </motion.div>
            )}

            {/* Step 1: Ingredients */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">Ingredients</h3>
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <input value={ing.amount} onChange={(e) => updateIngredient(i, 'amount', e.target.value)} className={inputClass + ' w-20'} placeholder="Amt" />
                    <input value={ing.unit} onChange={(e) => updateIngredient(i, 'unit', e.target.value)} className={inputClass + ' w-24'} placeholder="Unit" />
                    <input value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)} className={inputClass + ' flex-1'} placeholder="Ingredient name" />
                    <button type="button" onClick={() => removeIngredient(i)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={addIngredient} className="flex items-center gap-2 text-gold text-sm font-medium mt-2">
                  <Plus className="w-4 h-4" /> Add Ingredient
                </button>
              </motion.div>
            )}

            {/* Step 2: Instructions */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">Instructions</h3>
                {instructions.map((inst, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <input value={inst.title} onChange={(e) => updateInstruction(i, 'title', e.target.value)} className={inputClass + ' flex-1'} placeholder="Step title (optional)" />
                      <input type="number" value={inst.timer} onChange={(e) => updateInstruction(i, 'timer', parseInt(e.target.value) || 0)} className={inputClass + ' w-28'} placeholder="Timer (min)" />
                      <button type="button" onClick={() => removeInstruction(i)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea value={inst.description} onChange={(e) => updateInstruction(i, 'description', e.target.value)} className={inputClass + ' resize-none'} rows={2} placeholder="Describe this step..." />
                  </div>
                ))}
                <button type="button" onClick={addInstruction} className="flex items-center gap-2 text-gold text-sm font-medium">
                  <Plus className="w-4 h-4" /> Add Step
                </button>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">Review & Publish</h3>
                {coverImage && (
                  <img src={coverImage} alt="Preview" className="w-full h-48 object-cover rounded-xl" onError={(e) => e.target.style.display = 'none'} />
                )}
                <p className="text-sm text-gray-500">Check your recipe details before publishing. You can go back to edit any section.</p>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-3">
                {step === steps.length - 1 ? (
                  <>
                    <button type="button" onClick={handleSubmit((data) => onSubmit(data, 'draft'))} disabled={loading}
                      className="px-5 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      Save Draft
                    </button>
                    <button type="submit" disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-gold to-food-orange text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      Publish Recipe
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gold text-white text-sm font-semibold rounded-xl hover:bg-gold-dark transition-colors"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

const inputClass = 'w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-charcoal dark:text-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all';

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
