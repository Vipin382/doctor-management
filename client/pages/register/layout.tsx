import Image from "next/image";
import React from "react";

/**
 * Interface for the layout page component.
 */
interface LayoutPageInterface {
  children: React.ReactNode;
}

/**
 * Layout component for sign-in pages.
 *
 * @param {LayoutPageInterface} props - The component properties.
 * @returns {JSX.Element} - The rendered layout.
 */
const SigninPageLayout = ({ children }: LayoutPageInterface) => {
  return (
    <main className="w-full relative">
      {/* Background image for the layout. */}
      <Image
        src={"/images/layered.svg"}
        fill
        className="w-full h-full object-cover z-[-1] absolute"
        alt="loading"
      />
      {children}
    </main>
  );
};

export default SigninPageLayout;
