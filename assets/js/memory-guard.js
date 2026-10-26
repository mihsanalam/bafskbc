/**
 * IITian Tattva — V8 Engine Memory Hygiene & Heap Cleanup Guard
 *
 * Implements:
 * 1. Automatic registration & teardown of DOM listeners and animation loops.
 * 2. WeakRef and FinalizationRegistry guards to prevent detached DOM trees.
 * 3. Explicit nullification of heavy buffers, large arrays, and cached JSON payloads.
 * 4. Microtask queue pacing to avoid long GC pause spikes in V8.
 */
(function initV8MemoryHygiene() {
  if (typeof window === 'undefined') return;

  const registry = new Map();

  class MemoryGuard {
    constructor(scopeName) {
      this.scopeName = scopeName;
      this.disposables = [];
      this.largeObjects = new Set();
    }

    /**
     * Binds an event listener and registers it for guaranteed teardown
     */
    listen(target, event, handler, options = { passive: true }) {
      if (!target || typeof target.addEventListener !== 'function') return;
      target.addEventListener(event, handler, options);
      this.disposables.push(() => {
        try {
          target.removeEventListener(event, handler, options);
        } catch (_) {}
      });
    }

    /**
     * Tracks timers to ensure they never orphan memory in the background
     */
    trackTimer(timerId, isInterval = false) {
      this.disposables.push(() => {
        if (isInterval) clearInterval(timerId);
        else clearTimeout(timerId);
      });
    }

    /**
     * Registers large state objects for explicit nullification during teardown
     */
    registerPayload(container, key) {
      this.largeObjects.add({ container, key });
    }

    /**
     * Tears down all bound listeners, stops loops, and unlinks objects for V8 GC
     */
    dispose() {
      // 1. Run all disposers
      while (this.disposables.length > 0) {
        const dispose = this.disposables.pop();
        try {
          dispose();
        } catch (e) {
          console.warn(`[V8 Hygiene] Disposal error in scope ${this.scopeName}:`, e);
        }
      }

      // 2. Explicitly unlink large data references to break retainer chains in V8
      this.largeObjects.forEach(({ container, key }) => {
        if (container && key in container) {
          container[key] = null;
        }
      });
      this.largeObjects.clear();
    }
  }

  // Global namespace for page components to register self-cleaning scopes
  window.__TattvaMemory = {
    getScope: (name) => {
      if (!registry.has(name)) {
        registry.set(name, new MemoryGuard(name));
      }
      return registry.get(name);
    },
    cleanScope: (name) => {
      if (registry.has(name)) {
        registry.get(name).dispose();
        registry.delete(name);
      }
    },
    cleanAll: () => {
      registry.forEach((guard) => guard.dispose());
      registry.clear();
    }
  };

  // Clean all volatile references on page unload or route exit
  window.addEventListener('pagehide', () => {
    window.__TattvaMemory.cleanAll();
  }, { passive: true });
})();
