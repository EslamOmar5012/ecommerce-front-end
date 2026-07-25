import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, Upload, Camera } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { useUploadAvatarMutation } = useAuth();
  const uploadAvatarMutation = useUploadAvatarMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('avatar', selectedFile);
    uploadAvatarMutation.mutate(formData, {
      onSuccess: () => {
        setSelectedFile(null);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your account information and avatar picture</p>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-8 border border-slate-200/60 dark:border-slate-800">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="relative group">
            <img
              src={previewUrl || user?.profilePic || '/placeholder-avatar.png'}
              alt={user?.username}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary-500/20 shadow-xl bg-slate-100 dark:bg-slate-800"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary-600 text-white shadow-lg cursor-pointer hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.username}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator
              </span>
            )}

            {selectedFile && (
              <div className="pt-2">
                <Button
                  size="sm"
                  isLoading={uploadAvatarMutation.isPending}
                  onClick={handleUploadAvatar}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  Save New Avatar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <User className="w-5 h-5 text-primary-500" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Username</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.username}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <Mail className="w-5 h-5 text-primary-500" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Email Address</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <Phone className="w-5 h-5 text-primary-500" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Phone Number</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <Calendar className="w-5 h-5 text-primary-500" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Age</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.age || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
