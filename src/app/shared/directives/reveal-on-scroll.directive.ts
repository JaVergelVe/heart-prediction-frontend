import { Directive, ElementRef, OnDestroy, Renderer2, inject } from '@angular/core';

/**
 * Añade clases para una revelación suave al entrar en el viewport (CSS en `_landing-page.scss`).
 * Respeta `prefers-reduced-motion` y desconecta el observer tras la primera intersección.
 */
@Directive({
  selector: '[appRevealOnScroll]',
  standalone: false
})
export class RevealOnScrollDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  constructor() {
    const host = this.el.nativeElement;
    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(host, 'app-reveal--visible');
      return;
    }
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.renderer.addClass(host, 'app-reveal--visible');
      return;
    }
    this.renderer.addClass(host, 'app-reveal');
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(host, 'app-reveal--visible');
            this.observer?.disconnect();
            this.observer = undefined;
            break;
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -10% 0px' }
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
