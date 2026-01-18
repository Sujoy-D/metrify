import svgPaths from "../imports/svg-gdb1riyitb";
import shopifyLogo from "figma:asset/7ea2841e848cf0807470fd48bd7030520d4b3d32.png";

export function MetrifyLogo() {
  return (
    <div className="flex items-center gap-4">
      {/* Icon Container */}
      <div className="relative size-[100px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
        {/* Background Icon Layer */}
        <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[16px] size-[100px] top-0">
          <svg className="size-[55px]" fill="none" viewBox="0 0 44 44">
            <g opacity="0.4">
              <path d="M22 3.66667V40.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
              <path d={svgPaths.p3e5e4600} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
            </g>
          </svg>
        </div>
        {/* Foreground Icon */}
        <div className="absolute left-[25px] size-[50px] top-[25px]">
          <svg className="size-full" fill="none" viewBox="0 0 40 40">
            <path d={svgPaths.p9d4580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
            <path d={svgPaths.p17aff600} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          </svg>
        </div>
      </div>
      
      {/* Text Container */}
      <div className="flex flex-col gap-[4px]">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {/* Metrify Text */}
            <span 
              className="bg-clip-text font-['Arimo:Bold',sans-serif] font-bold text-[48px] leading-[54px] tracking-[-1.2px] text-transparent"
              style={{ 
                WebkitTextFillColor: "transparent", 
                backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)",
                backgroundClip: "text"
              }}
            >
              Metrify
            </span>
            {/* Dashboard Text */}
            <span className="font-['Arimo:Bold',sans-serif] font-bold text-[48px] leading-[54px] tracking-[-1.2px] text-[#000000]">
              &nbsp;Dashboard
            </span>
          </div>
          {/* "for" text */}
          <span className="font-['Arimo:Regular',sans-serif] font-normal text-[28px] leading-[54px] text-[#45556c]">
            for
          </span>
          {/* Shopify logo */}
          <img src={shopifyLogo} alt="Shopify" className="h-[38px] w-auto" />
        </div>
        {/* Tagline */}
        <div className="h-[24px]">
          <p className="font-['Arimo:Regular',sans-serif] font-normal text-[18px] leading-[24px] text-[#45556c]">
            AI-powered metrics for merchants
          </p>
        </div>
      </div>
    </div>
  );
}