'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: business, isLoading: bizLoading } = useQuery({
    queryKey: ['business'],
    queryFn: () => api.get('/business').then((r) => r.data)
  });

  const { data: aiSettings, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-settings'],
    queryFn: () => api.get('/business/ai-settings').then((r) => r.data)
  });

  const [bizForm, setBizForm] = useState({ name: '', phoneNumber: '', websiteUrl: '' });
  const [aiForm, setAiForm] = useState({
    welcomeMessage: '',
    qualificationPrompt: '',
    afterHoursMessage: '',
    timezone: 'Europe/London'
  });

  useEffect(() => {
    if (business) {
      setBizForm({
        name: business.name ?? '',
        phoneNumber: business.phoneNumber ?? '',
        websiteUrl: business.websiteUrl ?? ''
      });
    }
  }, [business]);

  useEffect(() => {
    if (aiSettings) {
      setAiForm({
        welcomeMessage: aiSettings.welcomeMessage ?? '',
        qualificationPrompt: aiSettings.qualificationPrompt ?? '',
        afterHoursMessage: aiSettings.afterHoursMessage ?? '',
        timezone: aiSettings.timezone ?? 'Europe/London'
      });
    }
  }, [aiSettings]);

  const updateBusiness = useMutation({
    mutationFn: () => api.patch('/business', bizForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast.success('Business details saved');
    },
    onError: () => toast.error('Failed to save')
  });

  const updateAi = useMutation({
    mutationFn: () => api.patch('/business/ai-settings', aiForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      toast.success('AI settings saved');
    },
    onError: () => toast.error('Failed to save')
  });

  const startPortal = useMutation({
    mutationFn: () =>
      api.post('/billing/portal-session', {
        returnUrl: window.location.href
      }),
    onSuccess: (res) => {
      window.location.href = res.data.url;
    },
    onError: () => toast.error('Could not open billing portal')
  });

  return (
    <div>
      <Header title="Settings" />
      <div className="p-6 max-w-3xl space-y-6">
        <Tabs defaultValue="business">
          <TabsList>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="ai">AI assistant</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Business details</CardTitle>
                <CardDescription>Update your business name and contact info</CardDescription>
              </CardHeader>
              <CardContent>
                {bizLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => { e.preventDefault(); updateBusiness.mutate(); }}
                  >
                    <div className="space-y-1">
                      <Label>Business name</Label>
                      <Input
                        value={bizForm.name}
                        onChange={(e) => setBizForm((f) => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Phone number</Label>
                      <Input
                        value={bizForm.phoneNumber}
                        onChange={(e) => setBizForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                        placeholder="+44 7700 900000"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Website URL</Label>
                      <Input
                        value={bizForm.websiteUrl}
                        onChange={(e) => setBizForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                        placeholder="https://tradebooking.co.uk"
                      />
                    </div>
                    <Button type="submit" disabled={updateBusiness.isPending}>
                      {updateBusiness.isPending ? 'Saving…' : 'Save changes'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI assistant configuration</CardTitle>
                <CardDescription>Customise how your AI chat widget behaves</CardDescription>
              </CardHeader>
              <CardContent>
                {aiLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => { e.preventDefault(); updateAi.mutate(); }}
                  >
                    <div className="space-y-1">
                      <Label>Welcome message</Label>
                      <Input
                        value={aiForm.welcomeMessage}
                        onChange={(e) => setAiForm((f) => ({ ...f, welcomeMessage: e.target.value }))}
                        placeholder="Hi! How can we help with your job today?"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Qualification instructions</Label>
                      <Input
                        value={aiForm.qualificationPrompt}
                        onChange={(e) => setAiForm((f) => ({ ...f, qualificationPrompt: e.target.value }))}
                        placeholder="Always ask for job type, location, and urgency"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>After-hours message</Label>
                      <Input
                        value={aiForm.afterHoursMessage}
                        onChange={(e) => setAiForm((f) => ({ ...f, afterHoursMessage: e.target.value }))}
                        placeholder="We're closed right now. We'll call you back tomorrow."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Timezone</Label>
                      <Input
                        value={aiForm.timezone}
                        onChange={(e) => setAiForm((f) => ({ ...f, timezone: e.target.value }))}
                        placeholder="Europe/London"
                      />
                    </div>
                    <Button type="submit" disabled={updateAi.isPending}>
                      {updateAi.isPending ? 'Saving…' : 'Save AI settings'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Manage your subscription and payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click below to open the Stripe billing portal where you can update your payment
                  method, view invoices, or cancel your subscription.
                </p>
                <Button
                  onClick={() => startPortal.mutate()}
                  disabled={startPortal.isPending}
                >
                  {startPortal.isPending ? 'Opening…' : 'Manage billing'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
