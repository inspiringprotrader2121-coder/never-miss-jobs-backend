'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { CheckCircle, Plus, Trash2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceRow {
  id?: string;
  name: string;
  durationMinutes: number;
  depositRequired: boolean;
  depositAmount: number | null;
}

interface SetupData {
  onboardingStep: number;
  onboardingComplete: boolean;
  name: string;
  industry: string;
  phoneNumber: string;
  websiteUrl: string;
  staffCount: number | null;
  callsPerDay: number | null;
  averageJobValue: number | null;
  emergencyServiceEnabled: boolean;
  openingHours: string;
  closingHours: string;
  weekendEnabled: boolean;
  services: ServiceRow[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 7;

const STEP_LABELS = [
  'Business Profile',
  'Services',
  'Working Hours',
  'Revenue Estimate',
  'Phone Setup',
  'Dashboard Preview',
  'Activation'
];

const INDUSTRIES = [
  'Plumbing',
  'Electrical',
  'Roofing',
  'Heating & Gas',
  'Carpentry & Joinery',
  'Painting & Decorating',
  'Tiling',
  'Flooring',
  'Plastering',
  'Landscaping',
  'Drainage',
  'Air Conditioning',
  'General Building',
  'Other'
];

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-medium text-slate-400">{STEP_LABELS[step - 1]}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800">
        <div
          className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex gap-1.5">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 h-0.5 rounded-full transition-colors duration-200 ${
              i + 1 < step
                ? 'bg-blue-600'
                : i + 1 === step
                ? 'bg-blue-500'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Business Profile ─────────────────────────────────────────────────

function StepBusinessProfile({
  data,
  onChange
}: {
  data: SetupData;
  onChange: (patch: Partial<SetupData>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Business Profile</h2>
        <p className="mt-1 text-sm text-slate-400">
          Tell us about your business so we can configure your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-slate-300">Business name</Label>
          <Input
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Smith Plumbing Ltd"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Trade type</Label>
          <select
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select trade type</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Business phone number</Label>
          <Input
            value={data.phoneNumber}
            onChange={(e) => onChange({ phoneNumber: e.target.value })}
            placeholder="+44 7700 900000"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Website URL <span className="text-slate-500">(optional)</span></Label>
          <Input
            value={data.websiteUrl}
            onChange={(e) => onChange({ websiteUrl: e.target.value })}
            placeholder="https://yourwebsite.co.uk"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Number of staff</Label>
          <Input
            type="number"
            min={1}
            value={data.staffCount ?? ''}
            onChange={(e) => onChange({ staffCount: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="e.g. 4"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Calls per day (approx.)</Label>
          <Input
            type="number"
            min={0}
            value={data.callsPerDay ?? ''}
            onChange={(e) => onChange({ callsPerDay: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="e.g. 10"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Average job value (£)</Label>
          <Input
            type="number"
            min={0}
            value={data.averageJobValue ?? ''}
            onChange={(e) => onChange({ averageJobValue: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="e.g. 350"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="flex items-center gap-3 pt-5">
          <input
            id="emergency"
            type="checkbox"
            checked={data.emergencyServiceEnabled}
            onChange={(e) => onChange({ emergencyServiceEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-blue-600"
          />
          <Label htmlFor="emergency" className="text-slate-300 cursor-pointer">
            We offer emergency / out-of-hours call-outs
          </Label>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Services ─────────────────────────────────────────────────────────

function StepServices({
  services,
  onChange
}: {
  services: ServiceRow[];
  onChange: (services: ServiceRow[]) => void;
}) {
  function addService() {
    onChange([
      ...services,
      { name: '', durationMinutes: 60, depositRequired: false, depositAmount: null }
    ]);
  }

  function removeService(index: number) {
    onChange(services.filter((_, i) => i !== index));
  }

  function updateService(index: number, patch: Partial<ServiceRow>) {
    onChange(services.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Services</h2>
        <p className="mt-1 text-sm text-slate-400">
          Add the services you offer. These will be available when customers book online.
        </p>
      </div>

      <div className="space-y-3">
        {services.map((svc, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-700 bg-slate-900 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Service {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeService(i)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-slate-300">Service name</Label>
                <Input
                  value={svc.name}
                  onChange={(e) => updateService(i, { name: e.target.value })}
                  placeholder="e.g. Boiler service"
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300">Duration (minutes)</Label>
                <Input
                  type="number"
                  min={15}
                  step={15}
                  value={svc.durationMinutes}
                  onChange={(e) => updateService(i, { durationMinutes: parseInt(e.target.value) || 60 })}
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300">Deposit amount (£)</Label>
                <Input
                  type="number"
                  min={0}
                  value={svc.depositAmount ?? ''}
                  onChange={(e) =>
                    updateService(i, {
                      depositAmount: e.target.value ? parseInt(e.target.value) : null,
                      depositRequired: !!e.target.value
                    })
                  }
                  placeholder="Leave blank if no deposit"
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addService}
        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add service
      </Button>

      {services.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          No services added yet. You can add them now or later from your dashboard.
        </p>
      )}
    </div>
  );
}

// ─── Step 3: Working Hours ────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function StepWorkingHours({
  data,
  onChange
}: {
  data: SetupData;
  onChange: (patch: Partial<SetupData>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Working Hours</h2>
        <p className="mt-1 text-sm text-slate-400">
          Set your standard working hours. The AI will use these to determine when you are available.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-slate-300">Opening time</Label>
          <Input
            type="time"
            value={data.openingHours || '08:00'}
            onChange={(e) => onChange({ openingHours: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Closing time</Label>
          <Input
            type="time"
            value={data.closingHours || '18:00'}
            onChange={(e) => onChange({ closingHours: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <div className="flex items-center gap-3">
          <input
            id="weekend"
            type="checkbox"
            checked={data.weekendEnabled}
            onChange={(e) => onChange({ weekendEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-slate-600 bg-slate-950 accent-blue-600"
          />
          <Label htmlFor="weekend" className="text-slate-300 cursor-pointer">
            We take bookings on weekends (Saturday and Sunday)
          </Label>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">
          Working days
        </p>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => {
            const isWeekend = day === 'Saturday' || day === 'Sunday';
            const active = isWeekend ? data.weekendEnabled : true;
            return (
              <div
                key={day}
                className={`rounded text-center py-2 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-blue-900/40 text-blue-300 border border-blue-800'
                    : 'bg-slate-800 text-slate-600 border border-slate-700'
                }`}
              >
                {day.slice(0, 3)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Revenue Estimate ─────────────────────────────────────────────────

function StepRevenueEstimate({ data }: { data: SetupData }) {
  const missedCallsPerDay = data.callsPerDay ? Math.round(data.callsPerDay * 0.3) : null;
  const recoveredPerMonth = missedCallsPerDay ? Math.round(missedCallsPerDay * 22 * 0.4) : null;
  const revenuePerMonth =
    recoveredPerMonth && data.averageJobValue
      ? recoveredPerMonth * data.averageJobValue
      : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Revenue Estimate</h2>
        <p className="mt-1 text-sm text-slate-400">
          Based on your business profile, here is what TradeBooking could recover for you.
        </p>
      </div>

      {revenuePerMonth ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-center">
              <p className="text-2xl font-bold text-white">{missedCallsPerDay}</p>
              <p className="text-xs text-slate-400 mt-1">Missed calls per day</p>
              <p className="text-xs text-slate-500 mt-0.5">(est. 30% of {data.callsPerDay} calls)</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-center">
              <p className="text-2xl font-bold text-white">{recoveredPerMonth}</p>
              <p className="text-xs text-slate-400 mt-1">Jobs recovered per month</p>
              <p className="text-xs text-slate-500 mt-0.5">(est. 40% conversion)</p>
            </div>
            <div className="rounded-lg border border-blue-900 bg-blue-950/40 p-4 text-center">
              <p className="text-2xl font-bold text-blue-300">
                £{revenuePerMonth.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">Additional revenue per month</p>
              <p className="text-xs text-slate-500 mt-0.5">at £{data.averageJobValue} avg. job value</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              These are conservative estimates based on industry averages. Actual results depend on
              your response rate, service area, and how quickly leads are followed up.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-6 text-center">
          <p className="text-sm text-slate-400">
            Complete your business profile (calls per day and average job value) to see your
            revenue estimate.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Step 5: Phone Setup ──────────────────────────────────────────────────────

function StepPhoneSetup() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Phone Setup</h2>
        <p className="mt-1 text-sm text-slate-400">
          TradeBooking uses a dedicated phone number to capture missed calls and send SMS confirmations.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm font-medium text-white mb-1">Your TradeBooking number</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            A dedicated UK phone number has been assigned to your account. When a customer calls
            this number and you miss it, TradeBooking automatically sends them an SMS and logs the
            lead in your dashboard.
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm font-medium text-white mb-3">How to set up call forwarding</p>
          <ol className="space-y-2 text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-blue-300 text-xs font-bold">1</span>
              Log in to your Twilio account at console.twilio.com
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-blue-300 text-xs font-bold">2</span>
              Navigate to Phone Numbers and select your TradeBooking number
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-blue-300 text-xs font-bold">3</span>
              Under Voice, set the webhook URL to your TradeBooking API endpoint
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-blue-300 text-xs font-bold">4</span>
              Forward your business number to the TradeBooking number when unanswered
            </li>
          </ol>
        </div>

        <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4">
          <p className="text-xs text-amber-400">
            Your account manager will assist with phone setup during your onboarding call. You can
            complete this step and come back to configure it later.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 6: Dashboard Preview ────────────────────────────────────────────────

function StepDashboardPreview() {
  const features = [
    { label: 'Lead inbox', desc: 'Every enquiry captured and organised in one place' },
    { label: 'Booking calendar', desc: 'Appointments synced with Google Calendar' },
    { label: 'SMS centre', desc: 'Automated confirmations and manual follow-ups' },
    { label: 'Call log', desc: 'Missed calls with voicemail transcripts' },
    { label: 'Revenue analytics', desc: 'Track jobs, no-shows, and recovered revenue' },
    { label: 'Team management', desc: 'Invite staff with role-based access' }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Your Dashboard</h2>
        <p className="mt-1 text-sm text-slate-400">
          Here is what you will have access to once your account is activated.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.label}
            className="flex gap-3 rounded-lg border border-slate-700 bg-slate-900 p-4"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">{f.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 7: Activation ───────────────────────────────────────────────────────

function StepActivation({ data }: { data: SetupData }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Ready to activate</h2>
        <p className="mt-1 text-sm text-slate-400">
          Review your setup summary below, then activate your account.
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900 divide-y divide-slate-800">
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-400">Business name</span>
          <span className="text-white font-medium">{data.name || '—'}</span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-400">Trade type</span>
          <span className="text-white font-medium">{data.industry || '—'}</span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-400">Phone number</span>
          <span className="text-white font-medium">{data.phoneNumber || '—'}</span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-400">Services configured</span>
          <span className="text-white font-medium">{data.services.length}</span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-400">Working hours</span>
          <span className="text-white font-medium">
            {data.openingHours || '08:00'} – {data.closingHours || '18:00'}
            {data.weekendEnabled ? ', incl. weekends' : ', Mon–Fri'}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-400">Emergency call-outs</span>
          <span className="text-white font-medium">
            {data.emergencyServiceEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
        <p className="text-sm text-blue-300">
          Clicking Activate will complete your setup and take you to your dashboard. You can update
          any of these settings at any time from the Settings page.
        </p>
      </div>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

const DEFAULT_DATA: SetupData = {
  onboardingStep: 1,
  onboardingComplete: false,
  name: '',
  industry: '',
  phoneNumber: '',
  websiteUrl: '',
  staffCount: null,
  callsPerDay: null,
  averageJobValue: null,
  emergencyServiceEnabled: false,
  openingHours: '08:00',
  closingHours: '18:00',
  weekendEnabled: false,
  services: []
};

export default function SetupPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<SetupData>(DEFAULT_DATA);
  const [saving, setSaving] = useState(false);
  const [initialised, setInitialised] = useState(false);

  // Load existing progress on mount
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }

    api
      .get<SetupData>('/setup/status')
      .then(({ data: status }) => {
        if (status.onboardingComplete) {
          router.replace('/dashboard');
          return;
        }
        setData((prev) => ({ ...prev, ...status }));
        setStep(Math.max(1, Math.min(status.onboardingStep, TOTAL_STEPS)));
        setInitialised(true);
      })
      .catch(() => setInitialised(true));
  }, [authLoading, user, router]);

  const patch = useCallback((updates: Partial<SetupData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  async function saveStep(targetStep: number) {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { step };

      if (step === 1) {
        Object.assign(payload, {
          name: data.name,
          industry: data.industry,
          phoneNumber: data.phoneNumber,
          websiteUrl: data.websiteUrl,
          staffCount: data.staffCount,
          callsPerDay: data.callsPerDay,
          averageJobValue: data.averageJobValue,
          emergencyServiceEnabled: data.emergencyServiceEnabled
        });
      } else if (step === 2) {
        payload['services'] = data.services;
      } else if (step === 3) {
        Object.assign(payload, {
          openingHours: data.openingHours,
          closingHours: data.closingHours,
          weekendEnabled: data.weekendEnabled
        });
      }

      const { data: updated } = await api.post<SetupData>('/setup/update', payload);
      setData((prev) => ({ ...prev, ...updated }));
      setStep(targetStep);
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate() {
    setSaving(true);
    try {
      await api.post('/setup/complete');
      toast.success('Account activated. Welcome to TradeBooking.');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to activate. Please try again.');
      setSaving(false);
    }
  }

  async function handleNext() {
    if (step === TOTAL_STEPS) {
      await handleActivate();
      return;
    }
    await saveStep(step + 1);
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  if (authLoading || !initialised) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-blue-700 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 9a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V9zM13 9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4zM13 15a1 1 0 00-1 1v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1h-4z" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-white">TradeBooking</span>
          </div>
          <span className="text-xs text-slate-500">Account setup</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-8">
          <ProgressBar step={step} />

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            {step === 1 && <StepBusinessProfile data={data} onChange={patch} />}
            {step === 2 && (
              <StepServices
                services={data.services}
                onChange={(services) => patch({ services })}
              />
            )}
            {step === 3 && <StepWorkingHours data={data} onChange={patch} />}
            {step === 4 && <StepRevenueEstimate data={data} />}
            {step === 5 && <StepPhoneSetup />}
            {step === 6 && <StepDashboardPreview />}
            {step === 7 && <StepActivation data={data} />}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1 || saving}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="bg-blue-700 hover:bg-blue-600 text-white min-w-[120px]"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === TOTAL_STEPS ? (
                'Activate account'
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
