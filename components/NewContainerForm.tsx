// components/NewContainerForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Loader2, UploadCloud } from 'lucide-react';

export default function NewContainerForm({ onClose, onCustomSuccess }: { onClose: () => void, onCustomSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    let fileUrl = null;
    let fileName = null;

    // 1. 如果选择了文件，先上传文件
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents') // 你的 Bucket 名字
        .upload(uniqueFileName, file);

      if (uploadError) {
        alert('文件上传失败: ' + uploadError.message);
        setLoading(false);
        return;
      }

      // 获取公开访问链接
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(uniqueFileName);
      
      fileUrl = publicUrl;
      fileName = file.name;
    }

    // 2. 准备所有数据
    const newContainer = {
      container_no: formData.get('container_no'),
      consignee: formData.get('consignee'), // 客户
      cargo_desc: formData.get('cargo_desc'), // 货物描述
      status: formData.get('status'), // 允许手动选状态
      etd: formData.get('etd') || null,
      lfd: formData.get('lfd') || null,
      file_url: fileUrl,  // 存入文件链接
      file_name: fileName // 存入原文件名
    };

    // 3. 存入数据库
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
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 第一行：柜号 + 状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">柜号 (Container No.)</label>
              <input name="container_no" required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="MSKU..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">当前状态 (Status)</label>
              <select name="status" className="w-full border border-gray-300 p-2.5 rounded-lg bg-white">
                <option value="On Board">已装船 (On Board)</option>
                <option value="Arrived">已到港 (Arrived)</option>
                <option value="Customs Clearance">清关中 (Customs)</option>
                <option value="Released">已放行 (Released)</option>
              </select>
            </div>
          </div>

          {/* 第二行：客户 + 货物内容 */}
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">客户 (Client)</label>
              <input name="consignee" required className="w-full border border-gray-300 p-2.5 rounded-lg" placeholder="公司名/人名" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">货物内容 (Cargo)</label>
              <input name="cargo_desc" className="w-full border border-gray-300 p-2.5 rounded-lg" placeholder="例如: 假发, 杂柜..." />
            </div>
          </div>

          {/* 第三行：日期 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ETD (发船日)</label>
              <input type="date" name="etd" className="w-full border border-gray-300 p-2.5 rounded-lg text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-bold text-red-600 mb-1">LFD (截关/免堆)</label>
              <input type="date" name="lfd" className="w-full border border-red-200 bg-red-50 p-2.5 rounded-lg text-slate-700" />
            </div>
          </div>

          {/* 文件上传区域 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition bg-slate-50">
            <label className="flex flex-col items-center cursor-pointer">
              <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600">点击上传文件 (PDF / Excel / 图片)</span>
              <span className="text-xs text-gray-400 mt-1">支持拖拽上传</span>
              <input type="file" name="file" className="hidden" accept=".pdf, .xlsx, .xls, .jpg, .png" />
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold transition shadow-md"
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> 上传中...</span> : '保存并上传'}
          </button>
        </form>
      </div>
    </div>
  );
}