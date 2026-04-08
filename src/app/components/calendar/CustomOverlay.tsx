"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/* ─── SVG Mask Data URIs ─── */
const MASK_HEART = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 207 207' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M176.3,31c-18.8-18.8-44.7-30.4-73.3-30.4C74.3,0.6,48.3,12.2,29.6,31S-0.8,75.7-0.8,104.3 c0,28.6,11.6,54.6,30.4,73.3S74.3,208,102.9,208c28.6,0,54.6-11.6,73.3-30.4s30.4-44.7,30.4-73.3C206.6,75.7,195,49.7,176.3,31z' fill='black'/%3E%3C/svg%3E\")";
const MASK_HEXAGON = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 277 301' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M108.103 8.24078C126.954 -2.64276 150.179 -2.64276 169.03 8.24078L246.169 52.7773C265.02 63.6609 276.633 83.7745 276.633 105.542V194.615C276.633 216.382 265.02 236.495 246.169 247.379L169.03 291.915C150.179 302.799 126.954 302.799 108.103 291.915L30.9635 247.379C12.1126 236.495 0.5 216.382 0.5 194.615V105.542C0.5 83.7745 12.1126 63.6609 30.9635 52.7773L108.103 8.24078Z' fill='black'/%3E%3C/svg%3E\")";
const MASK_STAR = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 401 401' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M184.218 4.26754C194.176 -1.31835 206.324 -1.31835 216.282 4.26754L240.677 17.9521C245.454 20.6316 250.826 22.0711 256.302 22.139L284.272 22.4854C295.688 22.6268 306.208 28.7005 312.039 38.517L326.324 62.5657C329.121 67.2747 333.053 71.2075 337.762 74.0045L361.811 88.2891C371.628 94.1199 377.701 104.64 377.843 116.057L378.189 144.026C378.257 149.502 379.697 154.875 382.376 159.651L396.061 184.047C401.646 194.004 401.646 206.152 396.061 216.11L382.376 240.505C379.697 245.282 378.257 250.654 378.189 256.131L377.843 284.1C377.701 295.516 371.628 306.036 361.811 311.867L337.762 326.152C333.053 328.949 329.121 332.882 326.324 337.591L312.039 361.639C306.208 371.456 295.688 377.529 284.272 377.671L256.302 378.017C250.826 378.085 245.454 379.525 240.677 382.204L216.282 395.889C206.324 401.475 194.176 401.475 184.218 395.889L159.823 382.204C155.046 379.525 149.674 378.085 144.198 378.017L116.228 377.671C104.812 377.529 94.2918 371.456 88.461 361.639L74.1764 337.591C71.3794 332.882 67.4466 328.949 62.7376 326.152L38.6888 311.867C28.8724 306.036 22.7987 295.516 22.6573 284.1L22.3109 256.131C22.243 250.654 20.8035 245.282 18.124 240.505L4.43942 216.11C-1.14647 206.152 -1.14647 194.004 4.43941 184.047L18.124 159.651C20.8035 154.875 22.243 149.502 22.3109 144.026L22.6573 116.057C22.7987 104.64 28.8724 94.1199 38.6888 88.2891L62.7376 74.0045C67.4466 71.2075 71.3793 67.2747 74.1764 62.5657L88.461 38.517C94.2918 28.7005 104.812 22.6268 116.228 22.4854L144.198 22.139C149.674 22.0711 155.046 20.6316 159.823 17.9521L184.218 4.26754Z' fill='black'/%3E%3C/svg%3E\")";
const MASK_GUM = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 444 442' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M204.205 4.63126C215.258 -1.54115 228.742 -1.54115 239.795 4.63125L266.874 19.7527C272.176 22.7136 278.139 24.3042 284.218 24.3792L315.264 24.762C327.936 24.9182 339.614 31.6297 346.086 42.4769L361.942 69.0507C365.046 74.2541 369.412 78.5999 374.639 81.6906L401.333 97.4751C412.229 103.918 418.971 115.543 419.128 128.158L419.512 159.064C419.588 165.116 421.186 171.052 424.16 176.33L439.35 203.287C445.55 214.29 445.55 227.713 439.35 238.717L424.16 265.674C421.186 270.952 419.588 276.888 419.512 282.94L419.128 313.846C418.971 326.461 412.229 338.086 401.333 344.529L374.639 360.313C369.412 363.404 365.046 367.75 361.942 372.953L346.086 399.527C339.614 410.374 327.936 417.086 315.264 417.242L284.218 417.625C278.139 417.7 272.176 419.29 266.874 422.251L239.795 437.373C228.742 443.545 215.258 443.545 204.205 437.373L177.126 422.251C171.824 419.29 165.861 417.7 159.782 417.625L128.736 417.242C116.064 417.086 104.386 410.374 97.9142 399.527L82.0583 372.953C78.9536 367.75 74.5882 363.404 69.3612 360.313L42.6671 344.529C31.7709 338.086 25.029 326.461 24.8721 313.846L24.4875 282.94C24.4123 276.888 22.8144 270.952 19.8401 265.674L4.65025 238.717C-1.55008 227.713 -1.55008 214.29 4.65025 203.287L19.8401 176.33C22.8144 171.052 24.4122 165.116 24.4875 159.064L24.8721 128.158C25.029 115.543 31.7709 103.918 42.6671 97.4751L69.3612 81.6906C74.5882 78.5999 78.9536 74.2541 82.0583 69.0507L97.9142 42.4769C104.386 31.6297 116.064 24.9182 128.736 24.762L159.782 24.3792C165.861 24.3042 171.824 22.7136 177.126 19.7527L204.205 4.63126Z' fill='black'/%3E%3C/svg%3E\")";

export type FrameData = { id: string; label: string; mask: string; isDefault?: boolean };

export const FRAMES: FrameData[] = [
    { id: 'rect', label: '▭', mask: 'none', isDefault: true },
    { id: 'heart', label: '♥', mask: MASK_HEART },
    { id: 'hexagon', label: '⬡', mask: MASK_HEXAGON },
    { id: 'gum', label: '◆', mask: MASK_GUM },
    { id: 'star', label: '★', mask: MASK_STAR },

];

/* Shapes excluded from rotation — visually symmetric or circular */
const NO_ROTATE_IDS = new Set(['rect', 'heart']);

export type AlignmentType = 'center' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/* ─── Tiny SVG Icon Components ─── */

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ImagePlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
        <line x1="16" y1="3" x2="16" y2="9" opacity="0.5" />
        <line x1="13" y1="6" x2="19" y2="6" opacity="0.5" />
    </svg>
);

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const GlobeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

/* ─── Styles ─── */
const OVERLAY_STYLES = `
  .co-no-scrollbar::-webkit-scrollbar { display: none; }
  .co-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes co-spin-mask {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes co-spin-img-reverse {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  @keyframes co-zoom-down {
    0%, 80% { transform: scale(1.45); }
    100%    { transform: scale(1); }
  }
  .co-zoom-in-out {
    animation: co-zoom-down 7s cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
  }
  .co-spin-mask {
    animation: co-spin-mask 7s cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
  }
  .co-spin-img {
    animation: co-spin-img-reverse 7s cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
  }

  @keyframes co-fade-in {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  .co-modal-enter {
    animation: co-fade-in 0.25s ease-out forwards;
  }

  @keyframes co-img-float {
    0%, 100% { filter: drop-shadow(0 8px 20px rgba(0,0,0,0.45)); }
    50%      { filter: drop-shadow(0 14px 30px rgba(0,0,0,0.55)); }
  }
  .co-float {
    animation: co-img-float 3s ease-in-out infinite;
  }
`;

interface CustomOverlayProps {
    primaryColor: string;
    monthKey?: string;
    renderTrigger?: (openEditor: () => void, hasImage: boolean) => React.ReactNode;
}

export default function CustomOverlay({ primaryColor, monthKey = "global", renderTrigger }: CustomOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [selectedFrameId, setSelectedFrameId] = useState<string>('heart');
    const [alignment, setAlignment] = useState<AlignmentType>('bottom-right');
    const [applyGlobal, setApplyGlobal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ─── Mount check for Portals ─── */
    useEffect(() => {
        setMounted(true);
    }, []);

    /* ─── Persistence ─── */
    useEffect(() => {
        try {
            const local = localStorage.getItem(`custom-overlay-${monthKey}`);
            const global = localStorage.getItem('custom-overlay-global');
            if (local) {
                const d = JSON.parse(local);
                setCustomImage(d.image || null);
                setSelectedFrameId(d.frameId || 'heart');
                setAlignment(d.alignment || 'bottom-right');
                setApplyGlobal(false);
            } else if (global) {
                const d = JSON.parse(global);
                setCustomImage(d.image || null);
                setSelectedFrameId(d.frameId || 'heart');
                setAlignment(d.alignment || 'bottom-right');
                setApplyGlobal(true);
            } else {
                setCustomImage(null);
                setApplyGlobal(false);
            }
        } catch { /* noop */ }
    }, [monthKey]);

    const saveConfig = useCallback((image: string | null, frameId: string, align: AlignmentType, globalFlag: boolean) => {
        try {
            if (image) {
                const payload = JSON.stringify({ image, frameId, alignment: align });
                if (globalFlag) {
                    for (let i = localStorage.length - 1; i >= 0; i--) {
                        const k = localStorage.key(i);
                        if (k?.startsWith('custom-overlay-') && k !== 'custom-overlay-global') localStorage.removeItem(k);
                    }
                    localStorage.setItem('custom-overlay-global', payload);
                } else {
                    localStorage.removeItem('custom-overlay-global');
                    localStorage.setItem(`custom-overlay-${monthKey}`, payload);
                }
            } else {
                globalFlag ? localStorage.removeItem('custom-overlay-global') : localStorage.removeItem(`custom-overlay-${monthKey}`);
            }
        } catch { /* noop */ }
    }, [monthKey]);

    const selectedFrame = FRAMES.find(f => f.id === selectedFrameId) || FRAMES[1];
    const isRotatable = !NO_ROTATE_IDS.has(selectedFrameId);

    /* ─── Handlers ─── */
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const val = ev.target?.result as string;
            if (val) { setCustomImage(val); saveConfig(val, selectedFrameId, alignment, applyGlobal); }
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // reset so same file can be re-selected
    };

    const handleRemove = () => { setCustomImage(null); saveConfig(null, selectedFrameId, alignment, applyGlobal); };

    const handleFrame = (id: string) => { setSelectedFrameId(id); saveConfig(customImage, id, alignment, applyGlobal); };
    const handleAlign = (a: AlignmentType) => { setAlignment(a); saveConfig(customImage, selectedFrameId, a, applyGlobal); };
    const handleGlobal = (v: boolean) => { setApplyGlobal(v); saveConfig(customImage, selectedFrameId, alignment, v); };

    /* ─── Position map ─── */
    const positionMap: Record<AlignmentType, string> = {
        'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2.5 sm:-mt-3 md:-mt-4',
        'top-left': 'top-3 left-3 sm:top-4 sm:left-4',
        'top-right': 'top-3 right-3 sm:top-4 sm:right-4',
        'bottom-left': 'bottom-8 left-3 sm:bottom-10 sm:left-4 md:bottom-12',
        'bottom-right': 'bottom-8 right-3 sm:bottom-10 sm:right-4 md:bottom-12',
    };

    const sizeMap: Record<AlignmentType, string> = {
        'center': 'w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52',
        'top-left': 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
        'top-right': 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
        'bottom-left': 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
        'bottom-right': 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
    };

    /* ─── Alignment icons with visual grid ─── */
    const alignOptions: { id: AlignmentType; label: string; row: number; col: number }[] = [
        { id: 'top-left', label: '↖', row: 0, col: 0 },
        { id: 'top-right', label: '↗', row: 0, col: 2 },
        { id: 'center', label: '⊙', row: 1, col: 1 },
        { id: 'bottom-left', label: '↙', row: 2, col: 0 },
        { id: 'bottom-right', label: '↘', row: 2, col: 2 },
    ];

    return (
        <>
            <style>{OVERLAY_STYLES}</style>

            {/* ═══ RENDERED OVERLAY IMAGE (Portalled to HeroSection root to escape nav container) ═══ */}
            {mounted && customImage && document.getElementById('hero-custom-overlay-root') && createPortal(
                <div className="absolute inset-0 pointer-events-none z-[15] overflow-hidden rounded-inherit">
                    <div className={`absolute ${positionMap[alignment]} ${sizeMap[alignment]} co-float`}>
                        {/* Mask wrapper — clips + rotates the shape; overflow:hidden ensures tight clipping */}
                        <div
                            className={`w-full h-full overflow-hidden ${isRotatable ? 'co-spin-mask' : ''}`}
                            style={{
                                WebkitMaskImage: selectedFrame.mask,
                                maskImage: selectedFrame.mask,
                                WebkitMaskSize: '100% 100%',
                                maskSize: '100% 100%',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                                borderRadius: selectedFrame.isDefault ? '20%' : 0,
                            }}
                        >
                            <div className={`w-full h-full ${isRotatable ? 'co-zoom-in-out' : ''}`}>
                                {/* Image counter-rotates + scaled up to fill the mask fully even in corners */}
                                <img
                                    src={customImage}
                                    alt="Custom Overlay"
                                    className={`w-full h-full object-cover ${isRotatable ? 'co-spin-img' : ''}`}
                                    style={{
                                        borderRadius: selectedFrame.isDefault ? '20%' : 0,
                                        transform: isRotatable ? undefined : 'scale(1)',
                                    }}
                                    draggable={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>,
                document.getElementById('hero-custom-overlay-root')!
            )}

            {/* ═══ TRIGGER — rendered by parent or fallback ═══ */}
            {renderTrigger
                ? renderTrigger(() => setIsOpen(true), !!customImage)
                : null
            }

            {/* ═══ EDITOR MODAL ═══ */}
            {mounted && isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setIsOpen(false)} />

                    {/* Panel */}
                    <div className="relative w-[340px] max-h-[85vh] overflow-y-auto co-no-scrollbar bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.7)] co-modal-enter">
                        {/* ── Header ── */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3 bg-[#1c1c1e]/80 backdrop-blur-xl rounded-t-[28px]">
                            <h3 className="text-white text-[15px] font-bold tracking-tight">Custom Image</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="px-5 pb-5 pt-1">
                            {!customImage ? (
                                /* ── Empty state ── */
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-36 border-2 border-dashed border-white/15 hover:border-white/35 rounded-2xl flex flex-col justify-center items-center cursor-pointer transition-all duration-300 group hover:bg-white/[0.03]"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/8 group-hover:bg-white/15 flex items-center justify-center mb-3 transition-colors text-white/40 group-hover:text-white/70">
                                        <UploadIcon />
                                    </div>
                                    <span className="text-white/50 text-xs font-semibold tracking-wide group-hover:text-white/70 transition-colors">
                                        Tap to upload image
                                    </span>
                                    <span className="text-white/25 text-[10px] mt-1">PNG, JPG, WebP</span>
                                </button>
                            ) : (
                                /* ── Editor controls ── */
                                <div className="flex flex-col gap-4">

                                    {/* Live Preview */}
                                    <div className="flex justify-center py-3">
                                        <div className="w-20 h-20 relative">
                                            <div
                                                className="w-full h-full overflow-hidden"
                                                style={{
                                                    WebkitMaskImage: selectedFrame.mask,
                                                    maskImage: selectedFrame.mask,
                                                    WebkitMaskSize: '100% 100%',
                                                    maskSize: '100% 100%',
                                                    WebkitMaskRepeat: 'no-repeat',
                                                    maskRepeat: 'no-repeat',
                                                    WebkitMaskPosition: 'center',
                                                    maskPosition: 'center',
                                                    borderRadius: selectedFrame.isDefault ? '20%' : 0,
                                                }}
                                            >
                                                <img src={customImage} alt="" className="w-full h-full object-cover" draggable={false} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Alignment ── */}
                                    <div>
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold mb-2 block">Position</span>
                                        <div className="inline-grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-black/30 rounded-xl border border-white/5">
                                            {[0, 1, 2].map(r =>
                                                [0, 1, 2].map(c => {
                                                    const opt = alignOptions.find(a => a.row === r && a.col === c);
                                                    if (!opt) return (
                                                        <div key={`${r}-${c}`} className="w-9 h-9 rounded-lg" />
                                                    );
                                                    const active = alignment === opt.id;
                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => handleAlign(opt.id)}
                                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${active
                                                                ? 'bg-white/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]'
                                                                : 'text-white/30 hover:bg-white/8 hover:text-white/60'
                                                                }`}
                                                            title={opt.id}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* ── Shape selector ── */}
                                    <div>
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold mb-2 block">Shape</span>
                                        <div className="flex gap-1.5 co-no-scrollbar overflow-x-auto pb-1">
                                            {FRAMES.map((f) => {
                                                const active = selectedFrameId === f.id;
                                                return (
                                                    <button
                                                        key={f.id}
                                                        onClick={() => handleFrame(f.id)}
                                                        className={`relative min-w-[46px] h-[54px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 border ${active
                                                            ? 'bg-white/12 border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.06)]'
                                                            : 'bg-black/30 border-transparent hover:bg-white/6 hover:border-white/10'
                                                            }`}
                                                    >
                                                        <div
                                                            style={{
                                                                backgroundColor: active ? '#fff' : '#8E8E93',
                                                                width: 24,
                                                                height: 24,
                                                                WebkitMaskImage: f.mask,
                                                                maskImage: f.mask,
                                                                WebkitMaskSize: '100% 100%',
                                                                maskSize: '100% 100%',
                                                                WebkitMaskRepeat: 'no-repeat',
                                                                maskRepeat: 'no-repeat',
                                                                WebkitMaskPosition: 'center',
                                                                maskPosition: 'center',
                                                                borderRadius: f.isDefault ? 4 : 0,
                                                                transition: 'background-color 0.2s',
                                                            }}
                                                        />
                                                        <span className={`text-[8px] font-bold uppercase tracking-wider ${active ? 'text-white/90' : 'text-white/30'}`}>
                                                            {f.id.slice(0, 4)}
                                                        </span>
                                                        {active && (
                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                                                <CheckIcon />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* ── Global toggle ── */}
                                    <button
                                        onClick={() => handleGlobal(!applyGlobal)}
                                        className="flex items-center gap-2.5 w-full text-left cursor-pointer bg-white/[0.04] hover:bg-white/[0.07] p-3 rounded-xl border border-white/8 transition-colors"
                                    >
                                        <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${applyGlobal ? 'bg-blue-500' : 'bg-white/10 border border-white/20'}`}>
                                            {applyGlobal && <CheckIcon />}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white/50">
                                            <GlobeIcon />
                                            <span className="text-[11px] text-white/70 font-medium leading-tight">Apply to all months</span>
                                        </div>
                                    </button>

                                    {/* ── Actions ── */}
                                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                        <button
                                            onClick={handleRemove}
                                            className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400/80 hover:text-red-300 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                        >
                                            <TrashIcon />
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-[11px] font-semibold text-white/50 hover:text-white/80 px-2.5 py-1.5 rounded-lg hover:bg-white/8 transition-colors"
                                        >
                                            Replace photo
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
            />
        </>
    );
}
