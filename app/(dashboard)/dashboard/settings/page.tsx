'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    User,
    Building2,
    Bell,
    Shield,
    Palette,
    Save,
    Loader2,
    Check,
    Mail,
    Phone,
    MapPin,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'company', name: 'Company', icon: Building2 },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '+880 1234-567890',
        role: session && session.user && 'role' in session.user ? (session.user as { role?: string }).role || 'staff' : 'staff',
        avatar: (session?.user as { avatar?: string })?.avatar || '',
    });

    const [company, setCompany] = useState({
        name: 'ClearLedger Business',
        email: 'info@clearledger.com',
        phone: '+880 1234-567890',
        address: '123 Business Street, Dhaka, Bangladesh',
        website: 'https://clearledger.com',
        taxId: 'TAX-123456789',
    });

    const [notifications, setNotifications] = useState({
        emailInvoice: true,
        emailPayment: true,
        emailReminder: false,
        pushInvoice: true,
        pushPayment: true,
        pushReminder: true,
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
                <p className="text-slate-500">Manage your account and application preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                                        : 'text-slate-600 hover:bg-slate-100'
                                )}
                            >
                                <tab.icon className="h-5 w-5 mr-3" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Profile Information</h3>
                                    <p className="text-sm text-slate-500">Update your personal details.</p>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200 overflow-hidden">
                                        {profile.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={profile.avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            profile.name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="avatar-upload"
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                if (file.size > 2 * 1024 * 1024) {
                                                    alert('File size exceeds 2MB.');
                                                    return;
                                                }
                                                const formData = new FormData();
                                                formData.append('avatar', file);
                                                if (session && session.user && 'id' in session.user) {
                                                    const res = await fetch(`/api/users/${(session.user as { id?: string }).id}`, {
                                                        method: 'PATCH',
                                                        body: formData,
                                                    });
                                                    if (res.ok) {
                                                        const user = await res.json();
                                                        setProfile((p) => ({ ...p, avatar: user.avatar }));
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                            onClick={() => document.getElementById('avatar-upload')?.click()}
                                            type="button"
                                        >
                                            Change Photo
                                        </button>
                                        <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                                        <input
                                            type="text"
                                            value={profile.role}
                                            disabled
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 capitalize"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Company Tab */}
                        {activeTab === 'company' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Company Information</h3>
                                    <p className="text-sm text-slate-500">This information will appear on your invoices.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Building2 className="inline h-4 w-4 mr-1" />
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={company.name}
                                            onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Mail className="inline h-4 w-4 mr-1" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={company.email}
                                            onChange={(e) => setCompany({ ...company, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Phone className="inline h-4 w-4 mr-1" />
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={company.phone}
                                            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <MapPin className="inline h-4 w-4 mr-1" />
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={company.address}
                                            onChange={(e) => setCompany({ ...company, address: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Globe className="inline h-4 w-4 mr-1" />
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            value={company.website}
                                            onChange={(e) => setCompany({ ...company, website: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Tax ID / VAT</label>
                                        <input
                                            type="text"
                                            value={company.taxId}
                                            onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Notification Preferences</h3>
                                    <p className="text-sm text-slate-500">Choose how you want to be notified.</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Email Notifications</h4>
                                        <div className="space-y-4">
                                            {[
                                                { key: 'emailInvoice', label: 'New invoice created', desc: 'Get notified when a new invoice is created' },
                                                { key: 'emailPayment', label: 'Payment received', desc: 'Get notified when a payment is recorded' },
                                                { key: 'emailReminder', label: 'Payment reminders', desc: 'Send automatic reminders for overdue invoices' },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                                        className={cn(
                                                            'w-12 h-7 rounded-full transition-colors relative',
                                                            notifications[item.key as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-slate-300'
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            'absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform',
                                                            notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-1'
                                                        )} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Security Settings</h3>
                                    <p className="text-sm text-slate-500">Manage your password and security preferences.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-4">Change Password</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Appearance</h3>
                                    <p className="text-sm text-slate-500">Customize the look and feel of your dashboard.</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Theme</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['Light', 'Dark', 'System'].map((theme) => (
                                                <button
                                                    key={theme}
                                                    className={cn(
                                                        'p-4 rounded-xl border-2 text-center transition-all',
                                                        theme === 'Light'
                                                            ? 'border-indigo-600 bg-indigo-50'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    )}
                                                >
                                                    <div className={cn(
                                                        'w-12 h-8 mx-auto rounded-lg mb-2',
                                                        theme === 'Light' ? 'bg-white border border-slate-200' :
                                                            theme === 'Dark' ? 'bg-slate-800' : 'bg-gradient-to-r from-white to-slate-800'
                                                    )} />
                                                    <span className="text-sm font-medium text-slate-700">{theme}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Accent Color</h4>
                                        <div className="flex space-x-3">
                                            {[
                                                { name: 'Indigo', color: 'bg-indigo-600' },
                                                { name: 'Blue', color: 'bg-blue-600' },
                                                { name: 'Emerald', color: 'bg-emerald-600' },
                                                { name: 'Rose', color: 'bg-rose-600' },
                                                { name: 'Amber', color: 'bg-amber-600' },
                                            ].map((c) => (
                                                <button
                                                    key={c.name}
                                                    className={cn(
                                                        'w-10 h-10 rounded-full transition-transform hover:scale-110',
                                                        c.color,
                                                        c.name === 'Indigo' && 'ring-2 ring-offset-2 ring-indigo-600'
                                                    )}
                                                    title={c.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={cn(
                                    'flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all',
                                    saved
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200'
                                )}
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : saved ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>{saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
