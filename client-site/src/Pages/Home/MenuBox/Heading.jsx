import headingbg from '../../../assets/—Pngtree—vintage yellow brown texture royal_1411071.jpg';
import chefsticker from '../../../assets/—Pngtree—chef hat cartoon white sticker_6065074.png';

const Heading = () => {
    return (
        <div className="relative h-20 w-44 flex items-center justify-center text-white text-2xl">
            {/* Background Image */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${headingbg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.9, // Adjust opacity of the background image here
                }}
            ></div>
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black opacity-40"></div>
            {/* Heading Text */}
            <h2 className="font-chewy text-3xl relative z-10">DEEDAR</h2>
            {/* Chef Hat Sticker */}
            <img
                src={chefsticker}
                alt="Chef Hat"
                className="absolute top-0 left-0 w-16 opacity-90 h-16" // Adjust size as needed
                style={{
                    transform: 'translate(-40%, -70%) rotate(-19deg)', // Rotate the hat
                }}
            />
        </div>
    );
};

export default Heading;
