import headingbg from '../../../assets/—Pngtree—vintage yellow brown texture royal_1411071.jpg';

const Heading = () => {
    return (
        <div
            className="relative h-20 w-44 flex items-center justify-center text-white text-2xl"
            style={{
                backgroundImage: `url(${headingbg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black opacity-30"></div>
            {/* Heading Text */}
            <h2 className="font-chewy text-3xl relative z-10">DEEDAR</h2>
        </div>
    );
};

export default Heading;
