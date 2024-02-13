import * as THREE from 'three';
import React, { createContext, useContext, useMemo, useEffect, useRef } from 'react';
import { useFrame, useThree, context as fiberContext } from '@react-three/fiber';
import { createRoot } from 'react-dom/client'; // React 18에서 createRoot 임포트
import mergeRefs from 'react-merge-refs';

const ScrollControlsContext = createContext(null);

export function useScroll() {
  return useContext(ScrollControlsContext);
}

export function ScrollControls({
  eps = 0.00001,
  enabled = true,
  infinite,
  horizontal,
  pages = 1,
  distance = 1,
  damping = 4,
  children
}) {
  const { gl, size, invalidate, events, raycaster } = useThree();
  const el = useRef(document.createElement('div'));
  const fill = useRef(document.createElement('div'));
  const fixed = useRef(document.createElement('div'));
  const target = gl.domElement.parentNode;
  const scroll = useRef(0);

  const state = useMemo(() => {
    const state = {
      el: el.current,
      eps,
      fill: fill.current,
      fixed: fixed.current,
      horizontal,
      damping,
      offset: 0,
      delta: 0,
      scroll,
      pages,
      range(from, distance, margin = 0) {
        const start = from - margin;
        const end = start + distance + margin * 2;
        return this.offset < start ? 0 : this.offset > end ? 1 : (this.offset - start) / (end - start);
      },
      curve(from, distance, margin = 0) {
        return Math.sin(this.range(from, distance, margin) * Math.PI);
      },
      visible(from, distance, margin = 0) {
        const start = from - margin;
        const end = start + distance + margin * 2;
        return this.offset >= start && this.offset <= end;
      }
    };
    return state;
  }, [eps, damping, horizontal, pages]);

  useEffect(() => {
    if (!target) return;
    el.current.style.position = 'absolute';
    el.current.style.width = '100%';
    el.current.style.height = '100%';
    el.current.style[horizontal ? 'overflowX' : 'overflowY'] = 'auto';
    el.current.style[horizontal ? 'overflowY' : 'overflowX'] = 'hidden';
    el.current.style.top = '0px';
    el.current.style.left = '0px';

    fixed.current.style.position = 'sticky';
    fixed.current.style.top = '0px';
    fixed.current.style.left = '0px';
    fixed.current.style.width = '100%';
    fixed.current.style.height = '100%';
    fixed.current.style.overflow = 'hidden';
    el.current.appendChild(fixed.current);

    fill.current.style.height = horizontal ? '100%' : `${pages * distance * 100}%`;
    fill.current.style.width = horizontal ? `${pages * distance * 100}%` : '100%';
    fill.current.style.pointerEvents = 'none';
    el.current.appendChild(fill.current);
    target.appendChild(el.current);

    el.current[horizontal ? 'scrollLeft' : 'scrollTop'] = 1;

    const oldTarget = typeof events.connected !== 'boolean' ? events.connected : gl.domElement;
    requestAnimationFrame(() => events.connect?.(el.current));
    const oldCompute = raycaster.computeOffsets;
    raycaster.computeOffsets = ({ clientX, clientY }) => ({
      offsetX: clientX - target.offsetLeft,
      offsetY: clientY - target.offsetTop
    });

    return () => {
      target.removeChild(el.current);
      raycaster.computeOffsets = oldCompute;
      events.connect?.(oldTarget);
    };
  }, [pages, distance, horizontal, target]);

  useEffect(() => {
    if (!el.current) return;
    const containerLength = size[horizontal ? 'width' : 'height'];
    const scrollLength = el.current[horizontal ? 'scrollWidth' : 'scrollHeight'];
    const scrollThreshold = scrollLength - containerLength;

    let current = 0;
    let disableScroll = true;
    let firstRun = true;

    const onScroll = (e) => {
      if (!enabled || firstRun) return;
      invalidate();
      current = el.current[horizontal ? 'scrollLeft' : 'scrollTop'];
      scroll.current = current / scrollThreshold;
      if (infinite) {
        if (!disableScroll) {
          if (scroll.current >= 1 - 0.001) {
            const damp = 1 - state.offset;
            el.current[horizontal ? 'scrollLeft' : 'scrollTop'] = 1;
            scroll.current = state.offset = -damp;
            disableScroll = true;
          } else if (current <= 0) {
            const damp = 1 + state.offset;
            el.current[horizontal ? 'scrollLeft' : 'scrollTop'] = scrollLength;
            scroll.current = state.offset = damp;
            disableScroll = true;
          }
        }
        if (disableScroll) setTimeout(() => (disableScroll = false), 40);
      }
    };

    el.current.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(() => (firstRun = false));

    const onWheel = (e) => (el.current.scrollLeft += e.deltaY / 2);
    if (horizontal) el.current.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      el.current.removeEventListener('scroll', onScroll);
      if (horizontal) el.current.removeEventListener('wheel', onWheel);
    };
  }, [el, size, infinite, state, invalidate, horizontal]);

  let last = 0;
  useFrame((_, delta) => {
    state.offset = THREE.MathUtils.damp((last = state.offset), scroll.current, damping, delta);
    state.delta = THREE.MathUtils.damp(state.delta, Math.abs(last - state.offset), damping, delta);
    if (state.delta > eps) invalidate();
  });

  return (
    <ScrollControlsContext.Provider value={state}>
      {children}
    </ScrollControlsContext.Provider>
  );
}

const ScrollCanvas = React.forwardRef(({ children }, ref) => {
  const group = useRef();
  const state = useScroll();
  const { width, height } = useThree((state) => state.viewport);
  useFrame(() => {
    group.current.position.x = state.horizontal ? -width * (state.pages - 1) * state.offset : 0;
    group.current.position.y = state.horizontal ? 0 : height * (state.pages - 1) * state.offset;
  });

  return <group ref={group}>{children}</group>;
});

const ScrollHtml = React.forwardRef(({ children, style, ...props }, ref) => {
  const state = useScroll();
  const group = useRef();
  const { width, height } = useThree((state) => state.size);
  const fiberState = useContext(fiberContext);

  useFrame(() => {
    if (state.delta > state.eps) {
      group.current.style.transform = `translate3d(${state.horizontal ? -width * (state.pages - 1) * state.offset : 0}px, ${
        state.horizontal ? 0 : height * (state.pages - 1) * -state.offset
      }px, 0)`;
    }
  });

  useEffect(() => {
    const root = createRoot(state.fixed); // state.fixed에 대한 root 생성
    root.render(
      <div
        ref={mergeRefs([ref, group])}
        style={{ ...style, position: 'absolute', top: 0, left: 0, willChange: 'transform' }}
        {...props}
      >
        <ScrollControlsContext.Provider value={state}>
          <fiberContext.Provider value={fiberState}>{children}</fiberContext.Provider>
        </ScrollControlsContext.Provider>
      </div>
    );
    return () => root.unmount(); // 컴포넌트 unmount 시 cleanup
  }, [children, style, props, ref, group, state, fiberState]); // 의존성 배열에 사용된 모든 변수 포함

  return null;
});

export const Scroll = React.forwardRef(({ html, ...props }, ref) => {
  const ScrollComponent = html ? ScrollHtml : ScrollCanvas;
  return <ScrollComponent ref={ref} {...props} />;
});
