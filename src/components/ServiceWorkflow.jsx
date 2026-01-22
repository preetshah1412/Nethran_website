import React from 'react'

export default function ServiceWorkflow() {
    const steps = [
        {
            id: 1,
            title: 'Discovery & Planning',
            desc: 'We analyze your requirements and develop a strategic roadmap for your project.',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            )
        },
        {
            id: 2,
            title: 'Solution Design',
            desc: 'Our experts design a tailored solution architecture to address your specific needs.',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
            )
        },
        {
            id: 3,
            title: 'Implementation',
            desc: 'We develop and implement the solution using industry best practices.',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            )
        },
        {
            id: 4,
            title: 'Testing & QA',
            desc: 'Rigorous quality assurance to ensure your solution meets all requirements.',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            id: 5,
            title: 'Deployment',
            desc: 'Smooth transition to production with minimal disruption to your operations.',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.18 0m5.18 0l2.83 2.83a2 2 0 01-2.83 2.83l-2.83-2.83m-5.18 0L4.76 19.34a2 2 0 01-2.83-2.83l2.83-2.83m10.36 0c1.3.65 2.83.27 3.66-1.1l-6.3-6.3a.6.6 0 00-.84 0l-6.3 6.3c.83 1.37 2.36 1.75 3.66 1.1l2.48-1.24a.6.6 0 01.54 0l2.48 1.24z" />
                </svg>
            )
        },
        {
            id: 6,
            title: 'Ongoing Support',
            desc: 'Continuous  maintenance, optimization, and support to ensure long-term success.',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                </svg>
            )
        }
    ]

    return (
        <section className="section" id="process">
            <div className="container">
                <div className="hero-inner">
                    <h2 className="headline reveal">Our Service Delivery Process</h2>
                    <p className="subhead reveal">
                        We follow a structured, collaborative approach to ensure successful outcomes for every project.
                    </p>
                </div>

                <div className="process-steps reveal">
                    {steps.map((step, idx) => (
                        <div className="process-step-container" key={step.id}>
                            {idx !== 0 && <div className="process-connector"></div>}
                            <div className="process-card card">
                                <div className="process-icon">{step.icon}</div>
                                <div>
                                    <h3 className="process-title">{step.title}</h3>
                                    <p className="process-desc">{step.desc}</p>
                                </div>
                                <div className="process-number">0{step.id}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
