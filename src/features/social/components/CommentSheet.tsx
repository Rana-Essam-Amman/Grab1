import React, { useEffect, useState } from 'react';
import { CloseCircle } from 'iconsax-react';
import { getComments, addComment, SocialComment } from '../services/socialService';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CommentSheetProps { listingId: string; onClose: () => void; onCommentAdded: () => void; }

export const CommentSheet: React.FC<CommentSheetProps> = ({ listingId, onClose, onCommentAdded }) => {
  const { isArabic } = useUI();
  const { user } = useAuth();
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => { getComments(listingId).then((c) => { setComments(c); setLoading(false); }); }, [listingId]);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    if (!user || !user.id) { toast.error(isArabic ? 'سجل دخول أولاً' : 'Please sign in first'); return; }
    setSubmitting(true);
    const ok = await addComment(listingId, text);
    setSubmitting(false);
    if (ok) {
      setText('');
      const updated = await getComments(listingId);
      setComments(updated);
      onCommentAdded();
    } else {
      toast.error(isArabic ? 'فشل إضافة التعليق' : 'Failed to add comment');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-ink/50 z-[60] animate-in fade-in" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-2xl h-[80vh] flex flex-col animate-in slide-in-from-bottom" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center p-3 border-b border-border relative">
          <div className="w-10 h-1 bg-border rounded-full absolute top-2" />
          <h3 className="font-bold text-ink text-base mt-2">{isArabic ? 'التعليقات' : 'Comments'}</h3>
          <button onClick={onClose} className="absolute end-4 top-4 p-1 text-ink-muted cursor-pointer">
            <CloseCircle size="24" variant="Bold" color="currentColor" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? <p className="text-center text-sm text-ink-muted">جاري التحميل...</p> : comments.length === 0 ? <p className="text-center text-sm text-ink-muted">كن أول من يعلق</p> : comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {c.user_avatar ? <img src={c.user_avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-primary font-bold text-sm">{c.user_name?.charAt(0)}</span>}
              </div>
              <div className="flex-1">
                <div className="bg-canvas rounded-2xl p-3">
                  <p className="font-bold text-sm text-ink mb-1">{c.user_name}</p>
                  <p className="text-sm text-ink-soft whitespace-pre-wrap">{c.content}</p>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 ms-1">{new Date(c.created_at).toLocaleDateString(isArabic ? 'ar-JO' : 'en-US')}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex gap-2 pb-8 bg-surface">
          <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder={isArabic ? 'اكتب تعليق...' : 'Write a comment...'} maxLength={1000} className="flex-1 p-3 rounded-xl border border-border bg-canvas text-base text-ink outline-none focus:border-primary" />
          <button onClick={handleSubmit} disabled={submitting || !text.trim()} className="px-5 py-3 bg-primary text-ink-inverse rounded-xl font-bold text-sm disabled:opacity-50 cursor-pointer">{submitting ? '...' : (isArabic ? 'إرسال' : 'Send')}</button>
        </div>
      </div>
    </>
  );
};
