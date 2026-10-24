import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { profileApi } from '../services/api/profileApi';
import { technologyOptions } from '../data/interviewOptions';
import { Save, User, Link as LinkIcon, Plus, X } from 'lucide-react';

export function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTargetRole(user.targetRole || '');
      setExperienceLevel(user.experienceLevel || '');
      setSelectedTechs(user.technologies || []);
      setGithub(user.githubUrl || '');
      setLinkedin(user.linkedinUrl || '');
      setPortfolio(user.portfolioUrl || '');
    }
  }, [user]);

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileApi.updateProfile({
        name,
        targetRole,
        experienceLevel,
        technologies: selectedTechs,
        github,
        linkedin,
        portfolio,
      });
      await checkAuth();
      toast('success', 'Profile updated successfully!');
    } catch (err: any) {
      toast('error', err.message || 'Failed to save profile changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-50">Profile Settings</h2>
        <p className="text-sm text-slate-400">Configure credentials, experience levels, and targeted technologies.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                className="bg-slate-950/80 cursor-not-allowed"
              />
              <Input
                label="Target Role"
                placeholder="e.g. Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <Input
                label="Experience Level"
                placeholder="e.g. Senior"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plus className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Technologies & Frameworks</h3>
            </div>
            <div className="flex flex-wrap gap-2">
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
                    {tech}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <LinkIcon className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Professional Links</h3>
            </div>
            <Input
              label="GitHub Link"
              placeholder="https://github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
            <Input
              label="LinkedIn Link"
              placeholder="https://linkedin.com/in/..."
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <Input
              label="Portfolio Site"
              placeholder="https://..."
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
            />
          </Card>

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            <Save className="h-4 w-4 mr-1.5" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
export default ProfilePage;
