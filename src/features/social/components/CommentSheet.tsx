// RULE-14-EXCEPTION: CommentSheet requires portal + visual viewport + threaded rendering
import React, { useEffect, useState, useRef } from 'react';
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
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalStyle; };
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handleResize = () => {
      const offset = window.innerHeight - vv.height;
      setBottomOffset(offset > 100 ? offset : 0);
    };
    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
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
    const ok = await addComment(listingId, text, parentId);
    setSubmitting(false);
    if (ok) {
      setText('');
      setParentId(null);
      setReplyingTo(null);
      const updated = await getComments(listingId);
      setComments(updated);
      onCommentAdded();
    } else {
      toast.error(isArabic ? 'فشل إضافة التعليق' : 'Failed to add comment');
    }
  };

  const handleReply = (id: string, name: string) => {
    setParentId(id);
    setReplyingTo(name);
    inputRef.current?.focus();
  };

  const topLevelComments = comments.filter(c => !c.parent_comment_id);
  const getReplies = (id: string) => comments.filter(c => c.parent_comment_id === id);

  const renderComment = (c: SocialComment, isReply = false) => (
    <div key={c.id} className={`flex gap-2 ${isReply ? 'mt-2' : 'mt-0'}`}>
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
        {c.user_avatar ? <img src={c.user_avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-primary font-bold text-xs">{c.user_name?.charAt(0)}</span>}
      </div>
      <div className="flex flex-col items-start max-w-[85%]">
        <div className="bg-canvas rounded-2xl px-3 py-2">
          <p className="font-semibold text-[13px] text-ink leading-tight">{c.user_name}</p>
          <p className="text-[15px] text-ink mt-0.5 whitespace-pre-wrap">{c.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 ms-2">
          <p className="text-[11px] text-ink-muted font-medium">{new Date(c.created_at).toLocaleDateString(isArabic ? 'ar-JO' : 'en-US')}</p>
          {!isReply && (
            <button onClick={() => handleReply(c.id, c.user_name)} className="text-[11px] font-bold text-ink-muted hover:text-ink">
              {isArabic ? 'رد' : 'Reply'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      <div className="fixed inset-0 bg-ink/60 z-[60] animate-in fade-in" onClick={onClose} style={{ bottom: bottomOffset > 0 ? `${bottomOffset}px` : 0 }} />
      
      <div className="fixed left-0 right-0 z-[61] bg-surface rounded-t-2xl flex flex-col animate-in slide-in-from-bottom shadow-2xl" dir={isArabic ? 'rtl' : 'ltr'} style={{ bottom: `${bottomOffset}px`, maxHeight: bottomOffset > 0 ? 'calc(100vh - 50px)' : '85dvh', height: bottomOffset > 0 ? `calc(${window.visualViewport?.height || window.innerHeight}px - 20px)` : 'auto' }}>
        
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
            topLevelComments.map(c => (
              <div key={c.id} className="flex flex-col">
                {renderComment(c, false)}
                {/* Render Replies */}
                <div className="ms-10 mt-1">
                  {getReplies(c.id).map(reply => renderComment(reply, true))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Replying To Banner */}
        {replyingTo && (
          <div className="px-3 py-1.5 bg-canvas border-t border-border flex items-center justify-between text-xs text-ink-muted">
            <span>{isArabic ? `ترد على ${replyingTo}` : `Replying to ${replyingTo}`}</span>
            <button onClick={() => { setReplyingTo(null); setParentId(null); }} className="font-bold cursor-pointer hover:text-ink">X</button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-2 border-t border-border flex items-end gap-2 bg-surface shrink-0 pb-safe">
          <div className="flex-1 min-w-0 bg-canvas rounded-full flex items-center px-3 py-2 border border-border">
            <Camera size="22" variant="Linear" className="text-ink-muted shrink-0 cursor-pointer" />
            <input 
              ref={inputRef}
              autoFocus 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder={isArabic ? 'اكتب تعليقاً...' : 'Write a comment...'} 
              maxLength={1000} 
              className="flex-1 min-w-0 bg-transparent px-2 text-[15px] text-ink outline-none placeholder:text-ink-muted" 
            />
          </div>
          
          {text.trim().length > 0 ? (
            <button onClick={handleSubmit} disabled={submitting} className="shrink-0 p-2 text-primary font-bold cursor-pointer">
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
