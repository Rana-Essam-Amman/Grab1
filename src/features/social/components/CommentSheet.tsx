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
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-surface rounded-t-2xl h-[85vh] flex flex-col animate-in slide-in-from-bottom" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-center p-3 border-b border-border relative shrink-0">
          <div className="w-10 h-1 bg-border rounded-full absolute top-2" />
          <h3 className="font-bold text-ink text-[15px] mt-2">{isArabic ? 'التعليقات' : 'Comments'}</h3>
          <button onClick={onClose} className="absolute end-4 top-4 p-1 text-ink-muted cursor-pointer hover:bg-canvas rounded-full transition">
            <CloseCircle size="24" variant="Bold" color="currentColor" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {loading ? (
            <p className="text-center text-[13px] text-ink-muted py-4">جاري التحميل...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-[13px] text-ink-muted py-4">كن أول من يعلق</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
                  {c.user_avatar ? (
                    <img src={c.user_avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-xs">{c.user_name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="bg-canvas rounded-2xl px-3 py-2">
                    <p className="font-semibold text-[13px] text-ink leading-tight">{c.user_name}</p>
                    <p className="text-[15px] text-ink mt-0.5 whitespace-pre-wrap">{c.content}</p>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-1 ms-2 font-medium">{new Date(c.created_at).toLocaleDateString(isArabic ? 'ar-JO' : 'en-US')}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area (Sticky) */}
        <div className="p-3 border-t border-border flex items-center gap-2 pb-8 bg-surface w-full shrink-0">
          <input 
            autoFocus 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder={isArabic ? 'اكتب تعليق...' : 'Write a comment...'} 
            maxLength={1000} 
            className="flex-1 min-w-0 px-4 py-2.5 rounded-full border border-border bg-canvas text-[15px] text-ink outline-none focus:border-primary" 
          />
          <button 
            onClick={handleSubmit} 
            disabled={submitting || !text.trim()} 
            className="shrink-0 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-[15px] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? '...' : (isArabic ? 'إرسال' : 'Send')}
          </button>
        </div>
      </div>
    </>
  );
};
