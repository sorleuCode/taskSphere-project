
import React from 'react'
import AOS from "aos";
import { useState, useEffect, useRef} from 'react';





const ProgressBar = ({ label, percentage }) => {
    const [width, setWidth] = useState(0);
    const progressBarRef = useRef(null);

    useEffect(() => {

        AOS.init();

    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setWidth(0); // Reset width to 0
                        setTimeout(() => setWidth(percentage), 300);
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        if (progressBarRef.current) {
            observer.observe(progressBarRef.current);
        }

        return () => {
            if (progressBarRef.current) {
                observer.unobserve(progressBarRef.current);
            }
        };
    }, [percentage]);

    return (
        <div ref={progressBarRef} className="mb-4">
            <div className="flex justify-between mb-1">
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full progress-bar"
                    style={{ "--progress-width": `${width}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;