'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, Upload } from 'lucide-react';
import { CertificationRecord } from '@/types';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification?: CertificationRecord | null;
  onSaveCertification: (cert: CertificationRecord) => void;
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  isOpen,
  onClose,
  certification,
  onSaveCertification,
}) => {
  const [formData, setFormData] = useState<Partial<CertificationRecord>>({
    name: '',
    organization: '',
    category: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    certificateFileUrl: '',
  });

  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (certification) {
      setFormData(certification);
      setFileName(certification.certificateFileUrl ? 'Certificate uploaded' : '');
    } else {
      setFormData({
        name: '',
        organization: '',
        category: '',
        issueDate: '',
        credentialId: '',
        credentialUrl: '',
        certificateFileUrl: '',
      });
      setFileName('');
    }
  }, [certification, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData({
        ...formData,
        certificateFileUrl: `local://${file.name}`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.organization?.trim()) return;

    const record: CertificationRecord = {
      id: certification?.id || `cert-${Date.now()}`,
      name: formData.name.trim(),
      organization: formData.organization.trim(),
      category: formData.category?.trim() || 'General Technical',
      issueDate: formData.issueDate || '',
      credentialId: formData.credentialId?.trim() || '',
      credentialUrl: formData.credentialUrl?.trim() || '',
      certificateFileUrl: formData.certificateFileUrl || '',
    };

    onSaveCertification(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {certification ? 'Edit Certification' : 'Add Certification'}
            </h2>
            <p className="text-xs text-slate-500">
              Upload and verify real credentials to boost evidence-backed skill confidence.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Certification Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Certified Cloud Practitioner, Meta Frontend Developer"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Issuing Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. AWS, Coursera, Oracle, Cisco"
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Skill / Category</label>
              <input
                type="text"
                placeholder="e.g. Cloud, Python, Web Dev"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Issue Date</label>
              <input
                type="text"
                placeholder="e.g. Sept 2024"
                value={formData.issueDate || ''}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Credential ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. ABC-123456"
                value={formData.credentialId || ''}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Credential Verification URL</label>
            <input
              type="url"
              placeholder="https://coursera.org/verify/..."
              value={formData.credentialUrl || ''}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Certificate Upload (PDF / Image)</label>
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-600">
                {fileName || 'Click to upload certificate document'}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 10MB</span>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Save Certification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
