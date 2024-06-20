const styles = {
    boxWidth: "xl:max-w-[1280px] w-full",
  
    heading: "font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full",
    body: "font-poppins font-normal text-black text-[18px]",

    heading2: "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
    paragraph: "font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px]",
  
    flexCenter: "flex justify-center items-center",
    flexStart: "flex justify-center items-start",
  
    paddingX: "sm:px-16 px-6",
    paddingY: "sm:py-16 py-6",
    padding: "sm:px-16 px-6 sm:py-6 py-4",
  
    marginX: "sm:mx-8 mx-6",
    marginY: "sm:my-8 my-6",

    defaultBackground: "saturate-100 bg-gradient-to-br from-rose-100 to-emerald-200 via-blue-100",
    boxBackground: "saturate-100 bg-gradient-to-br from-blue-300 to-purple-400 via-sky-300",

    greyBackground: "bg-cyan-400 rounded-md my-8 mx-12",
    defBackground: "bg-white rounded-md my-8 mx-12",

    container: "flex h-full",
    leftSection: "flex-auto p-8",
    rightSection: "flex-1 flex flex-col p-8",
    upperHalf: "flex-2 p-8 border-b border-gray-300",
    lowerHalf: "flex-1 p-8",
    popupContainer: "relative bottom-0 left-0 w-[80%] p-8",
    popup: "bg-white shadow p-4 rounded",
    popupcontent: "text-black",
    calendar: "flex"
  };
  
  export const layout = {
    section: `flex md:flex-row flex-col ${styles.paddingY}`,
    sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,
  
    sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
    sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
  
    sectionInfo: `flex-1 ${styles.flexStart} flex-col`,

    signupStyle: `flex ${styles.flexCenter} flex-col space-y-3`
  };
  
  export default styles;