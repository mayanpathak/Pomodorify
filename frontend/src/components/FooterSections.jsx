export default function FooterSection() {
    return (
        <>  
            {/* -- base color*/}
            <footer className="footer footer-center text-white-content rounded mt-20 p-10">
                <nav>
                    <div className="grid grid-flow-col gap-4">
                        <a href="" target="_blank" rel="noopener noreferrer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path
                                    d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                        </a>
                        <a href="" target="_blank" rel="noopener noreferrer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path d="M12 .5C5.373.5 0 5.873 0 12.5c0 5.245 3.438 9.688 8.207 11.285.6.11.793-.26.793-.577 0-.285-.01-1.237-.015-2.25-3.338.723-4.043-1.608-4.043-1.608-.546-1.382-1.333-1.752-1.333-1.752-1.089-.743.083-.729.083-.729 1.204.083 1.838 1.234 1.838 1.234 1.069 1.843 2.8 1.309 3.486 1.002.108-.774.419-1.309.762-1.607-2.665-.305-5.467-1.334-5.467-5.933 0-1.313.469-2.384 1.236-3.219-.124-.303-.536-1.529.117-3.176 0 0 1.008-.322 3.299 1.229a11.486 11.486 0 0 1 3.003-.404c1.021.004 2.041.138 3.003.404 2.291-1.551 3.299-1.229 3.299-1.229.653 1.647.241 2.873.118 3.176.77.835 1.236 1.906 1.236 3.219 0 4.618-2.805 5.623-5.476 5.92.43.372.815 1.103.815 2.226 0 1.607-.014 2.904-.014 3.295 0 .321.189.694.798.577A12.514 12.514 0 0 0 24 12.5C24 5.873 18.627.5 12 .5z"/>
                            </svg>
                        </a>
                        <a href="" target="_blank" rel="noopener noreferrer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"  
                                height="26" 
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="3"/> 
                                <circle cx="12" cy="12" r="5" fill="white"/> 
                            </svg>
                        </a>

                        
                    </div>
                </nav>
            </footer>
        </>
    );
}
