import { baseListings } from "../../data/listings";

export default function DeviceCard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-[#6E9F94] to-[#127058] bg-clip-text text-black">
          Trending Devices
        </h3>
        <p className="text-gray-600 mt-1 font-medium">
          Certified by our expert technicians
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {baseListings.map((device) => (
          <div 
            key={device.id} 
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
              <img 
                src={device.img} 
                alt={device.title} 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
              
              {/* Category Badge using your custom orange color (#ef9f27) */}
              <span className="absolute top-3 left-3 bg-[#ef9f27] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm capitalize">
                {device.category}
              </span>
            </div>

            {/* Device Details */}
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="font-bold text-gray-800 text-lg line-clamp-1 mb-2">
                {device.title}
              </h4>
              
              {/* Pricing section with installment context */}
              <div className="flex items-baseline gap-2 mb-4 mt-auto">
                <span className="text-xl font-extrabold text-gray-900">
                  ${device.current_price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${device.original_price}
                </span>
                <span className="text-xs text-emerald-600 font-medium ml-auto bg-emerald-50 px-2 py-0.5 rounded">
                  From ${(device.current_price / 12).toFixed(0)}/mo
                </span>
              </div>

              {/* View Details CTA using your primary branding color */}
              <button className="w-full bg-[#127058] hover:bg-[#0e5845] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
