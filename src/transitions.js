export function interpolatePosition(from, to, elapsed, duration = 260) {
  const progress = Math.max(0, Math.min(1, elapsed / duration));
  return from + (to - from) * (1 - (1 - progress) ** 3);
}

export function createTransitions() {
  let frame = 0;
  let current = 0;
  const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  function position(target, draw, animate = false) {
    cancelAnimationFrame(frame);
    if (!animate || !motionOK() || current === target) {
      current = target;
      draw(target);
      return;
    }
    const from = current;
    const start = performance.now();
    function tick(now) {
      const elapsed = motionOK() ? Math.max(0, now - start) : 260;
      current = interpolatePosition(from, target, elapsed);
      draw(current);
      if (elapsed < 260) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }
  function reveal(nodes, delay = 0) {
    for (const node of nodes) {
      node.getAnimations().forEach(animation => animation.cancel());
      if (motionOK()) node.animate([{ opacity: .25, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180, delay, easing: 'ease-out', fill: 'backwards' });
    }
  }
  return { position, reveal };
}
