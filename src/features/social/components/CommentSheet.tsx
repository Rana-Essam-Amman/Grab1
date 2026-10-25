// RULE-14-EXCEPTION: CommentSheet requires portal + visual viewport + FB-like composer
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseCircle, Camera, Add, Send } from 'iconsax-react';
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
  
  // State to track keyboard height
  const [bottomOffset, setBottomOffset] = useState(0);

  // Prevent background scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Visual Viewport API to handle mobile keyboard resize
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      // Calculate how much the keyboard pushed the viewport up
      const offset = window.innerHeight - vv.height;
      // If offset is significantly large, keyboard is likely open
      setBottomOffset(offset > 100 ? offset : 0);
    };

    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
    
    // Initial check
    handleResize();

    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => { 
    getComments(listingId).then((c) => { setComments(c); setLoading(false); }); 
  }, [listingId]);

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

  // We use inline style for `bottom` to push the sheet exactly above the keyboard
  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-ink/60 z-[60] animate-in fade-in" 
        onClick={onClose} 
        style={{ bottom: bottomOffset > 0 ? `${bottomOffset}px` : 0 }}
      />
      
      <div 
        className="fixed left-0 right-0 z-[61] bg-surface rounded-t-2xl flex flex-col animate-in slide-in-from-bottom shadow-2xl" 
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{ 
          bottom: `${bottomOffset}px`,
          maxHeight: bottomOffset > 0 ? 'calc(100vh - 50px)' : '85dvh',
          height: bottomOffset > 0 ? `calc(${window.visualViewport?.height || window.innerHeight}px - 20px)` : 'auto'
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-center p-3 border-b border-border relative shrink-0">
          <div className="w-12 h-1 bg-border rounded-full absolute top-2" />
          <h3 className="font-bold text-ink text-[15px] mt-2">{isArabic ? 'التعليقات' : 'Comments'}</h3>
          <button onClick={onClose} className="absolute end-4 top-4 p-1 text-ink-muted cursor-pointer hover:bg-canvas rounded-full transition">
            <CloseCircle size="24" variant="Bold" color="currentColor" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-4">
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

        {/* Facebook-Style Input Area */}
        <div className="p-2 border-t border-border flex items-end gap-2 bg-surface shrink-0 pb-safe">
          <div className="flex-1 min-w-0 bg-canvas rounded-full flex items-center px-3 py-2 border border-border">
            <Camera size="22" variant="Linear" className="text-ink-muted shrink-0 cursor-pointer" />
            <input 
              autoFocus 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder={isArabic ? 'اكتب تعليقاً...' : 'Write a comment...'} 
              maxLength={1000} 
              className="flex-1 min-w-0 bg-transparent px-2 text-[15px] text-ink outline-none placeholder:text-ink-muted" 
            />
          </div>
          
          {text.trim().length > 0 ? (
            <button 
              onClick={handleSubmit} 
              disabled={submitting} 
              className="shrink-0 p-2 text-primary font-bold cursor-pointer"
            >
              {submitting ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Send size="26" variant="Bold" />}
            </button>
          ) : (
            <button className="shrink-0 p-2 text-ink-muted cursor-pointer">
              <Add size="26" variant="Linear" />
            </button>
          )}
        </div>

      </div>
    </>,
    document.body
  );
};
