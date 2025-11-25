// components/NewContainerForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Loader2, UploadCloud, MapPin } from 'lucide-react';

export default function NewContainerForm({ onClose, onCustomSuccess }: { onClose: () => void, onCustomSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    let fileUrl = null;
    let fileName = null;

    // 1. 上传文件逻辑
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage.from('documents').upload(uniqueFileName, file);
      if (error) {
        alert('文件上传失败: ' + error.message);
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(uniqueFileName);
      fileUrl = publicUrl;
      fileName = file.name;
    }

    // 2. 准备数据
    const newContainer = {
      container_no: formData.get('container_no'),
      consignee: formData.get('consignee'),
      destination_port: formData.get('destination_port'), // ✨ 获取目的港
      cargo_desc: formData.get('cargo_desc'),
      status: formData.get('status'),
      etd: formData.get('etd') || null,
      lfd: formData.get('lfd') || null,
      file_url: fileUrl,
      file_name: fileName
    };

    const { error } = await supabase.from('containers').insert([newContainer]);

    setLoading(false);
    if (error) {
      alert('保存失败: ' + error.message);
    } else {
      onCustomSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">新增货柜 (New Entry)</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: 柜号 + 状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">柜号 (Container No.)</label>
              <input name="container_no" required className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="MSKU..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">状态 (Status)</label>
              <select name="status" className="w-full border border-gray-300 p-2.5 rounded-lg bg-white">
                <option value="On Board">已装船 (On Board)</option>
                <option value="Arrived">已到港 (Arrived)</option>
                <option value="Customs Clearance">清关中 (Customs)</option>
                <option value="Released">已放行 (Released)</option>
              </select>
            </div>
          </div>

          {/* Row 2: 客户 + 目的港 (新增) */}
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">客户 (Consignee)</label>
              <input name="consignee" required className="w-full border border-gray-300 p-2.5 rounded-lg" placeholder="Client Name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">目的港 (Port)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input name="destination_port" className="w-full border border-gray-300 p-2.5 pl-9 rounded-lg" placeholder="Santos / Itajaí" />
              </div>
            </div>
          </div>

          {/* Row 3: 货物描述 (全宽) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">货物内容 (Cargo Description)</label>
            <input name="cargo_desc" className="w-full border border-gray-300 p-2.5 rounded-lg" placeholder="例如: 假发, 杂柜, 汽车配件..." />
          </div>

          {/* Row 4: 日期 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ETD (发船)</label>
              <input type="date" name="etd" className="w-full border border-gray-300 p-2.5 rounded-lg text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-bold text-red-600 mb-1">LFD (免堆期)</label>
              <input type="date" name="lfd" className="w-full border border-red-200 bg-red-50 p-2.5 rounded-lg text-slate-700" />
            </div>
          </div>

          {/* 上传区域 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition bg-slate-50">
            <label className="flex flex-col items-center cursor-pointer">
              <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600">上传文件 (PDF / Excel)</span>
              <input type="file" name="file" className="hidden" accept=".pdf, .xlsx, .xls, .jpg, .png" />
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold shadow-md">
            {loading ? '保存中...' : '保存货柜'}
          </button>
        </form>
      </div>
    </div>
  );
}