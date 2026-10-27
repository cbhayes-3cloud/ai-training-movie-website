import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AccountMenu } from 'reelscore';

/*
 * The AccountMenu, anchored under NavBar's avatar. NavBar only exposes an
 * onAccount callback, so the avatar is found by its class to place the menu,
 * mark it expanded, and take focus back on Escape.
 */

const avatar = () => document.querySelector<HTMLButtonElement>('.rs-nav .rs-avatar');

export function AccountDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number }>();

  // The nav is sticky, so a fixed menu under the avatar stays put while the page scrolls.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = avatar()?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 8, right: Math.max(16, document.documentElement.clientWidth - r.right) });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open]);

  useEffect(() => {
    const btn = avatar();
    btn?.setAttribute('aria-haspopup', 'menu');
    btn?.setAttribute('aria-expanded', String(open));
    if (!open) return;
    ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    // Outside clicks close it; the avatar's own click toggles it through onAccount.
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !avatar()?.contains(t)) onClose();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, onClose]);

  if (!open || !pos) return null;
  return (
    <div ref={ref} className="account-dropdown" style={{ top: pos.top, right: pos.right }}>
      <AccountMenu
        onSelect={onClose}
        onClose={() => {
          onClose();
          avatar()?.focus();
        }}
      />
    </div>
  );
}
