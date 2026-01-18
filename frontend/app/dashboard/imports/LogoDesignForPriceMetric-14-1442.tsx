import svgPaths from "./svg-gdb1riyitb";

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute css-ew64yg font-['Arimo:Bold',sans-serif] font-bold leading-[36px] left-[576.81px] text-[#0f172b] text-[30px] text-center top-[-2.78px] translate-x-[-50%]">Metrify Logo Design</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[576.33px] text-[#45556c] text-[16px] text-center top-[-2.11px] translate-x-[-50%]">Adjust algorithm weights and track price recommendations for your Shopify store</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[76px] items-start left-0 top-0 w-[1152px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start left-0 top-[-6.22px] w-[120.236px]" data-name="Text">
      <p className="bg-clip-text css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[36px] min-h-px min-w-px relative text-[36px] text-[rgba(0,0,0,0)] tracking-[-0.9px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)" }}>
        Metrify
      </p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start left-[120.24px] top-[-6.22px] w-[184.194px]" data-name="Text">
      <p className="css-ew64yg font-['Arimo:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[#0f172b] text-[36px] tracking-[-0.9px]">Dashboard</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[304.431px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[304.431px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#45556c] text-[14px]">AI-powered metrics for merchants</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[62px] items-start left-[92px] top-[9px] w-[304.431px]" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Icon" opacity="0.4">
          <path d="M22 3.66667V40.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
          <path d={svgPaths.p3e5e4600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[80px] top-0" data-name="Container">
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[20px] size-[40px] top-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d={svgPaths.p9d4580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d={svgPaths.p17aff600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[80px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Container4 />
      <Icon1 />
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute h-[80px] left-[377.78px] top-[48px] w-[396.431px]" data-name="Logo">
      <Container3 />
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[24px] left-[48px] top-[160px] w-[1056px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[528.94px] text-[#62748e] text-[16px] text-center top-[-2.11px] translate-x-[-50%]">Primary Logo - Light Background</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-white h-[232px] left-0 rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[140px] w-[1152px]" data-name="Container">
      <Logo />
      <Container6 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-[-4.44px] w-[80.153px]" data-name="Text">
      <p className="bg-clip-text css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[24px] min-h-px min-w-px relative text-[24px] text-[rgba(0,0,0,0)] tracking-[-0.6px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)" }}>
        Metrify
      </p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-[80.15px] top-[-4.44px] w-[122.792px]" data-name="Text">
      <p className="css-ew64yg font-['Arimo:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[24px] text-white tracking-[-0.6px]">Dashboard</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[24px] relative shrink-0 w-[202.944px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text2 />
        <Text3 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[15.986px] relative shrink-0 w-[202.944px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[12px] text-[rgba(255,255,255,0.8)]">AI-powered metrics for merchants</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[45.986px] items-start left-[60px] top-px w-[202.944px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon" opacity="0.4">
          <path d="M14 2.33333V25.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
          <path d={svgPaths.p2a38c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.3)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[48px] top-0" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[24px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M16 7H22V13" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <path d={svgPaths.p13253c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[48px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(124, 134, 255) 0%, rgb(173, 70, 255) 100%)" }}>
      <Container11 />
      <Icon3 />
    </div>
  );
}

function Logo1() {
  return (
    <div className="absolute h-[48px] left-[148.53px] top-[48px] w-[262.944px]" data-name="Logo">
      <Container10 />
      <Container12 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[48px] top-[112px] w-[464px]" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#90a1b9] text-[14px] text-center">On Dark Background</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#0f172b] col-[1] css-3foyfs relative rounded-[16px] row-[1] self-stretch shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
      <Logo1 />
      <Container13 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-[-4.44px] w-[80.153px]" data-name="Text">
      <p className="bg-clip-text css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[24px] min-h-px min-w-px relative text-[24px] text-[rgba(0,0,0,0)] tracking-[-0.6px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)" }}>
        Metrify
      </p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-[80.15px] top-[-4.44px] w-[122.792px]" data-name="Text">
      <p className="css-ew64yg font-['Arimo:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[24px] text-white tracking-[-0.6px]">Dashboard</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[24px] relative shrink-0 w-[202.944px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text4 />
        <Text5 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[15.986px] relative shrink-0 w-[202.944px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[12px] text-[rgba(255,255,255,0.8)]">AI-powered metrics for merchants</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[45.986px] items-start left-[60px] top-px w-[202.944px]" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon" opacity="0.4">
          <path d="M14 2.33333V25.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
          <path d={svgPaths.p2a38c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.3)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[48px] top-0" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[12px] size-[24px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M16 7H22V13" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <path d={svgPaths.p13253c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[48px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(124, 134, 255) 0%, rgb(173, 70, 255) 100%)" }}>
      <Container18 />
      <Icon5 />
    </div>
  );
}

function Logo2() {
  return (
    <div className="absolute h-[48px] left-[148.53px] top-[48px] w-[262.944px]" data-name="Logo">
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[48px] top-[112px] w-[464px]" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#e0e7ff] text-[14px] text-center">On Colored Background</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="col-[2] css-3foyfs relative rounded-[16px] row-[1] self-stretch shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(162.181deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)" }}>
      <Logo2 />
      <Container20 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute gap-[32px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[180px] left-0 top-[404px] w-[1152px]" data-name="Container">
      <Container14 />
      <Container21 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[28px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[28px] min-h-px min-w-px relative text-[#0f172b] text-[20px] text-center">Size Variations</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-0 top-[-3.56px] w-[60.125px]" data-name="Text">
      <p className="bg-clip-text css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[18px] min-h-px min-w-px relative text-[18px] text-[rgba(0,0,0,0)] text-center tracking-[-0.45px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)" }}>
        Metrify
      </p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[60.13px] top-[-3.56px] w-[92.097px]" data-name="Text">
      <p className="css-ew64yg font-['Arimo:Bold',sans-serif] font-bold leading-[18px] relative shrink-0 text-[#0f172b] text-[18px] text-center tracking-[-0.45px]">Dashboard</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[18px] left-[44px] top-[7px] w-[152.222px]" data-name="Container">
      <Text6 />
      <Text7 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon" opacity="0.4">
          <path d="M10 1.66667V18.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
          <path d={svgPaths.p3055a600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
        </g>
      </svg>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[32px] top-0" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3155f180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pea6a680} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[32px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Container24 />
      <Icon7 />
    </div>
  );
}

function Logo3() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Logo">
      <Container23 />
      <Container25 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[15.986px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#62748e] text-[12px] text-center">Small</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[55.986px] items-start left-[22.72px] top-[24px] w-[196.222px]" data-name="Container">
      <Logo3 />
      <Paragraph1 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-[-4.44px] w-[80.153px]" data-name="Text">
      <p className="bg-clip-text css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[24px] min-h-px min-w-px relative text-[24px] text-[rgba(0,0,0,0)] text-center tracking-[-0.6px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)" }}>
        Metrify
      </p>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-[80.15px] top-[-4.44px] w-[122.792px]" data-name="Text">
      <p className="css-ew64yg font-['Arimo:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#0f172b] text-[24px] text-center tracking-[-0.6px]">Dashboard</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[24px] relative shrink-0 w-[202.944px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text8 />
        <Text9 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[15.986px] relative shrink-0 w-[202.944px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#45556c] text-[12px] text-center">AI-powered metrics for merchants</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[45.986px] items-start left-[60px] top-px w-[202.944px]" data-name="Container">
      <Container27 />
      <Container28 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon" opacity="0.4">
          <path d="M14 2.33333V25.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
          <path d={svgPaths.p2a38c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
        </g>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[48px] top-0" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[12px] size-[24px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M16 7H22V13" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <path d={svgPaths.p13253c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[48px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Container30 />
      <Icon9 />
    </div>
  );
}

function Logo4() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Logo">
      <Container29 />
      <Container31 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[15.986px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#62748e] text-[12px] text-center">Medium</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[71.986px] items-start left-[296.4px] top-[16px] w-[262.944px]" data-name="Container">
      <Logo4 />
      <Paragraph2 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start left-0 top-[-6.22px] w-[120.236px]" data-name="Text">
      <p className="bg-clip-text css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[36px] min-h-px min-w-px relative text-[36px] text-[rgba(0,0,0,0)] text-center tracking-[-0.9px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(79, 57, 246) 0%, rgb(152, 16, 250) 100%)" }}>
        Metrify
      </p>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start left-[120.24px] top-[-6.22px] w-[184.194px]" data-name="Text">
      <p className="css-ew64yg font-['Arimo:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[#0f172b] text-[36px] text-center tracking-[-0.9px]">Dashboard</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[304.431px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text10 />
        <Text11 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[20px] relative shrink-0 w-[304.431px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#45556c] text-[14px] text-center">AI-powered metrics for merchants</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[62px] items-start left-[92px] top-[9px] w-[304.431px]" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Icon" opacity="0.4">
          <path d="M22 3.66667V40.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
          <path d={svgPaths.p3e5e4600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[80px] top-0" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[20px] size-[40px] top-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d={svgPaths.p9d4580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d={svgPaths.p17aff600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[80px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Container36 />
      <Icon11 />
    </div>
  );
}

function Logo5() {
  return (
    <div className="h-[80px] relative shrink-0 w-full" data-name="Logo">
      <Container35 />
      <Container37 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex h-[15.986px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#62748e] text-[12px] text-center">Large</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[103.986px] items-start left-[636.81px] top-0 w-[396.431px]" data-name="Container">
      <Logo5 />
      <Paragraph3 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[103.986px] relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container32 />
      <Container38 />
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[32px] h-[259.986px] items-start left-0 pb-0 pt-[48px] px-[48px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[616px] w-[1152px]" data-name="Container">
      <Heading1 />
      <Container39 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex h-[28px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold',sans-serif] font-bold leading-[28px] min-h-px min-w-px relative text-[#0f172b] text-[20px] text-center">Icon Only</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon" opacity="0.4">
          <path d="M10 1.66667V18.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
          <path d={svgPaths.p3055a600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[32px] top-0" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3155f180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pea6a680} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Logo6() {
  return (
    <div className="absolute left-[400px] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[32px] top-[24px]" data-name="Logo" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Container41 />
      <Icon13 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon" opacity="0.4">
          <path d="M14 2.33333V25.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
          <path d={svgPaths.p2a38c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91667" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[48px] top-0" data-name="Container">
      <Icon14 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[12px] size-[24px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M16 7H22V13" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <path d={svgPaths.p13253c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Logo7() {
  return (
    <div className="absolute left-[480px] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[48px] top-[16px]" data-name="Logo" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Container42 />
      <Icon15 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Icon" opacity="0.4">
          <path d="M22 3.66667V40.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
          <path d={svgPaths.p3e5e4600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.58333" />
        </g>
      </svg>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-center justify-center left-0 rounded-[14px] size-[80px] top-0" data-name="Container">
      <Icon16 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-[20px] size-[40px] top-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d={svgPaths.p9d4580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
          <path d={svgPaths.p17aff600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16667" />
        </g>
      </svg>
    </div>
  );
}

function Logo8() {
  return (
    <div className="absolute left-[576px] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[80px] top-0" data-name="Logo" style={{ backgroundImage: "linear-gradient(135deg, rgb(97, 95, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Container43 />
      <Icon17 />
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[80px] relative shrink-0 w-full" data-name="Container">
      <Logo6 />
      <Logo7 />
      <Logo8 />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[32px] h-[236px] items-start left-0 pb-0 pt-[48px] px-[48px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[907.99px] w-[1152px]" data-name="Container">
      <Heading2 />
      <Container44 />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[1143.986px] relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container7 />
      <Container22 />
      <Container40 />
      <Container45 />
    </div>
  );
}

export default function LogoDesignForPriceMetric() {
  return (
    <div className="content-stretch flex flex-col items-start pb-0 pt-[32px] px-[82.667px] relative size-full" data-name="Logo Design for Price Metric" style={{ backgroundImage: "linear-gradient(137.472deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Container46 />
    </div>
  );
}