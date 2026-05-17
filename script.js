// BlueScore landing page — minimal interactions
// Mirrors the Run2Beat script: reveal on scroll, smooth anchor scrolling
// and a subtle parallax on the ambient orbs.
(() => {
    "use strict";

    // ---------- Reveal-on-scroll ----------
    // Only apply the fade to elements that start below the initial viewport,
    // so the hero/first-section content is visible immediately.
    const candidateSelector =
        ".feature, .section, .cta, .badge, .trio__card, .audience__pill, .languages__item";
    const viewportH = window.innerHeight || 800;
    const revealTargets = [];

    document.querySelectorAll(candidateSelector).forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top > viewportH * 0.85) {
            el.classList.add("reveal");
            revealTargets.push(el);
        }
    });

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
        );
        revealTargets.forEach((el) => io.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add("is-visible"));
    }

    // Safety net: ensure all content is visible after 4s no matter what.
    setTimeout(() => {
        document
            .querySelectorAll(".reveal:not(.is-visible)")
            .forEach((el) => el.classList.add("is-visible"));
    }, 4000);

    // ---------- Smooth scroll for in-page anchors ----------
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href").slice(1);
            if (!id) return;
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // ---------- Subtle parallax for ambient orbs ----------
    let ticking = false;
    const orbs = document.querySelectorAll(".ambient");
    window.addEventListener(
        "scroll",
        () => {
            if (ticking || orbs.length === 0) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                const y = window.scrollY;
                orbs.forEach((orb, i) => {
                    const factor = i === 0 ? 0.15 : -0.1;
                    orb.style.transform = `translate3d(0, ${y * factor}px, 0)`;
                });
                ticking = false;
            });
        },
        { passive: true }
    );
})();
