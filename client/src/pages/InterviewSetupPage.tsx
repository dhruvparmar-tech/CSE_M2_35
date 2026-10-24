import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from '../components/ui/Toast';
import { interviewApi } from '../services/api/interviewApi';
import {
  roles,
  experienceLevels,
  difficulties,
  interviewTypes,
  technologyOptions,
  topicOptions,
  durationOptions,
  questionCountOptions,
} from '../data/interviewOptions';
import { Check, Settings, Briefcase, Target, ShieldCheck } from 'lucide-react';

const schema = z.object({
  role: z.string().min(1, 'Please select a role'),
  experienceLevel: z.string().min(1, 'Please select experience level'),
  difficulty: z.string().min(1, 'Please select difficulty'),
  interviewType: z.string().min(1, 'Please select interview type'),
  duration: z.coerce.number().min(5, 'Duration must be at least 5 minutes'),
  questionCount: z.coerce.number().min(1, 'Select at least 1 question'),
});

type FormData = z.infer<typeof schema>;

export function InterviewSetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      duration: 45,
      questionCount: 10,
    },
  });

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const onSubmit = async (data: FormData) => {
    if (selectedTechs.length === 0) {
      toast('warning', 'Please select at least one technology.');
      return;
    }
    setLoading(true);
    try {
      const interview = await interviewApi.createInterview({
        role: data.role,
        experienceLevel: data.experienceLevel,
        difficulty: data.difficulty,
        interviewType: data.interviewType,
        technologies: selectedTechs,
        topics: selectedTopics.length > 0 ? selectedTopics : selectedTechs,
        duration: data.duration,
        questionCount: data.questionCount,
      });
      toast('success', 'Configured interview session.');
      navigate(`/interview/${interview.id}`);
    } catch (e: any) {
      toast('error', e.message || 'Failed to create interview session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-50">Setup Interview Session</h2>
        <p className="text-sm text-slate-400">Configure parameters to customize the AI evaluation rubrics.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Briefcase className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Role & Scope Settings</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Target Role"
                options={roles.map((r) => ({ value: r, label: r }))}
                error={errors.role?.message}
                {...register('role')}
              />
              <Select
                label="Experience Level"
                options={experienceLevels.map((el) => ({ value: el, label: el }))}
                error={errors.experienceLevel?.message}
                {...register('experienceLevel')}
              />
              <Select
                label="Interview Difficulty"
                options={difficulties.map((d) => ({ value: d, label: d }))}
                error={errors.difficulty?.message}
                {...register('difficulty')}
              />
              <Select
                label="Interview Type"
                options={interviewTypes.map((t) => ({ value: t, label: t }))}
                error={errors.interviewType?.message}
                {...register('interviewType')}
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Target className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Technologies & Topics</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select Core Technologies</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {technologyOptions.map((tech) => {
                  const active = selectedTechs.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Topics (Optional)</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {topicOptions.map((topic) => {
                  const active = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Session Constants</h3>
            </div>
            <Select
              label="Duration"
              options={durationOptions.map((d) => ({ value: d.toString(), label: `${d} minutes` }))}
              error={errors.duration?.message}
              {...register('duration')}
            />
            <Select
              label="Question Count"
              options={questionCountOptions.map((q) => ({ value: q.toString(), label: `${q} questions` }))}
              error={errors.questionCount?.message}
              {...register('questionCount')}
            />
          </Card>

          <Card className="space-y-4 bg-indigo-950/10 border-indigo-900/30">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="font-semibold text-sm">Evaluation Guarantee</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We leverage real-time OpenAI evaluation schemas validated using structures that confirm answers across accuracy and completeness metrics.
            </p>
            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Create Session
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}
export default InterviewSetupPage;
