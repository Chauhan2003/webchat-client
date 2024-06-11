const LoadingSpinner = ({ size = "lg" }) => {
    const sizeClass = `loading-${size}`;

    return <span className={`loading loading-dots ${sizeClass}`} />;
};

export default LoadingSpinner;