import React, { useEffect, useRef, useState } from "react";

type RevealProps = {
    children: React.ReactNode;
    className?: string;
    /** Initial translateY in px (positive = move down) */
    y?: number;
    /** Initial translateX in px (positive = move right) */
    x?: number;
    /** Opacity start value (0-1) */
    fromOpacity?: number;
    /** Animation duration in ms */
    durationMs?: number;
    /** Delay before animating in ms */
    delayMs?: number;
    /** Trigger only once */
    once?: boolean;
    /** Intersection observer root margin */
    rootMargin?: string;
};

export default function Reveal({
    children,
    className,
    y = 20,
    x = 0,
    fromOpacity = 0,
    durationMs = 600,
    delayMs = 0,
    once = true,
    rootMargin = "0px 0px -10% 0px",
}: RevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        if (once) observer.disconnect();
                    } else if (!once) {
                        setVisible(false);
                    }
                });
            },
            {
                root: null,
                rootMargin,
                threshold: 0.1,
            }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [once, rootMargin]);

    const initialTransform = `translate(${x}px, ${y}px)`;
    const finalTransform = `translate(0px, 0px)`;

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: visible ? finalTransform : initialTransform,
                opacity: visible ? 1 : fromOpacity,
                transition: `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, opacity ${durationMs}ms ease ${delayMs}ms`,
                willChange: "transform, opacity",
            }}
        >
            {children}
        </div>
    );
}


