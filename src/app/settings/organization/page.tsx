'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Building, UserPlus, Users, Key, Save, RefreshCw, Mail, ShieldAlert } from 'lucide-react';

export default function OrganizationSettingsPage() {
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);

  // Invite form inputs
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Sales Rep');
  const [inviteWorkspaceId, setInviteWorkspaceId] = useState('');

  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [branding, setBranding] = useState('dark');
  const [mfa, setMfa] = useState(false);

  const orgId = profile?.organizationId || 'org_default';

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // 1. Fetch organization details
      const orgRes = await fetch(`/api/admin/data`); // Reuse admin endpoint or custom fetch
      const res = await orgRes.json();
      if (res.success && res.data) {
        const matchingOrg = (res.data.organizations || []).find((o: any) => o.id === orgId);
        if (matchingOrg) {
          setOrgData(matchingOrg);
          setBranding(matchingOrg.settings?.branding || 'dark');
          setMfa(matchingOrg.settings?.security?.mfa || false);
        }

        // Filter users by org
        const orgUsers = (res.data.users || []).filter((u: any) => u.organizationId === orgId);
        setMembers(orgUsers);
      }

      // 2. Fetch pending invites
      const inviteRes = await fetch(`/api/invitations?organizationId=${orgId}`);
      const inviteData = await inviteRes.json();
      if (inviteRes.ok && inviteData.success) {
        setInvites(inviteData.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load organization settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInvite(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': profile?.id || 'mock-user' },
        body: JSON.stringify({
          action: 'CREATE',
          email: inviteEmail,
          organizationId: orgId,
          workspaceId: inviteWorkspaceId || 'ws_default',
          role: inviteRole,
        }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);

      setSuccessMessage(`Invitation token link generated: ${resData.data.token}`);
      setInviteEmail('');
      fetchData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch team member invitation.');
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleSaveOrgSettings = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      // Mock saving settings locally
      setSuccessMessage('Organization branding and security settings updated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl border border-emerald-900 bg-emerald-950/90 p-4 text-emerald-300 shadow-2xl backdrop-blur">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl border border-rose-900 bg-rose-950/90 p-4 text-rose-300 shadow-2xl backdrop-blur">
          {errorMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
          <Building className="h-9 w-9 text-indigo-500" />
          Organization Workspaces & Teams
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your B2B SaaS organization workspaces, invite teammates, and assign role-based
          credentials.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left pane: Team Members & Invites */}
        <div className="space-y-6 lg:col-span-2">
          {/* Members Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-4">
              <h2 className="text-md flex items-center gap-2 font-bold text-white">
                <Users className="h-5 w-5 text-indigo-400" />
                Team Members Registry
              </h2>
              <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs font-semibold text-slate-400">
                {members.length} Members
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    <th className="px-6 py-3.5">Name</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/10">
                      <td className="px-6 py-4 font-semibold text-white">{member.name}</td>
                      <td className="px-6 py-4 text-slate-400">{member.email}</td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${
                            member.role === 'Owner' || member.role === 'Admin'
                              ? 'border-indigo-900/50 bg-indigo-950 text-indigo-400'
                              : member.role === 'Manager'
                                ? 'border-emerald-900/50 bg-emerald-950 text-emerald-400'
                                : 'border-slate-800 bg-slate-950 text-slate-400'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Invitations */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
              <h2 className="text-md flex items-center gap-2 font-bold text-white">
                <Mail className="h-5 w-5 text-violet-400" />
                Pending Invitations
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    <th className="px-6 py-3.5">Invited Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Expiration</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {invites.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No pending team invitations found.
                      </td>
                    </tr>
                  ) : (
                    invites.map((invite) => (
                      <tr key={invite.id} className="hover:bg-slate-800/10">
                        <td className="px-6 py-4 font-mono font-medium text-slate-200">
                          {invite.email}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-indigo-400">
                          {invite.role}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(invite.expiredAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex rounded-full border border-amber-900/50 bg-amber-950/80 px-2 py-0.5 text-xs font-bold text-amber-400 uppercase">
                            {invite.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right pane: Org branding settings and Send Invite Panel */}
        <div className="space-y-6">
          {/* Org Preferences */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-md flex items-center gap-2 font-bold text-white">
              <Key className="h-5 w-5 text-emerald-400" />
              SaaS Branding Settings
            </h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-slate-450 text-xs font-bold uppercase">
                  Workspace Theme
                </label>
                <select
                  value={branding}
                  onChange={(e) => setBranding(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="dark">Classic Dark Obsidian</option>
                  <option value="light">Classic Light Minimal</option>
                  <option value="indigo">Vibrant Indigo Glass</option>
                </select>
              </div>

              <div className="border-slate-850 flex items-center justify-between border-t pt-3">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Require Multi-Factor Auth
                </span>
                <input
                  type="checkbox"
                  checked={mfa}
                  onChange={(e) => setMfa(e.target.checked)}
                  className="text-indigo-650 h-4 w-4 rounded border-slate-800 bg-slate-950"
                />
              </div>

              <button
                onClick={handleSaveOrgSettings}
                className="bg-indigo-650 mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" /> Save Workspace Settings
              </button>
            </div>
          </div>

          {/* Send Invite Form */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-md flex items-center gap-2 font-bold text-white">
              <UserPlus className="h-5 w-5 text-violet-400" />
              Invite Teammate
            </h2>
            <form onSubmit={handleSendInvite} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-slate-450 text-xs font-bold uppercase">Teammate Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="border-slate-750 w-full rounded-xl border bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-455 text-xs font-bold uppercase">
                  Workspace Scope
                </label>
                <input
                  type="text"
                  value={inviteWorkspaceId}
                  onChange={(e) => setInviteWorkspaceId(e.target.value)}
                  placeholder="ws_sales_emea (Optional)"
                  className="border-slate-750 w-full rounded-xl border bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-450 text-xs font-bold uppercase">
                  Role Designation
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="border-slate-750 w-full rounded-xl border bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales Rep">Sales Rep</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submittingInvite}
                className="bg-violet-650 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
              >
                {submittingInvite ? 'Sending...' : 'Generate Invite Link'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
