function LayoutWithWidth({ children }) {
    return (
        <div className="max-w-[1600px] m-auto">
            {children}
        </div>
    )
}

export default LayoutWithWidth