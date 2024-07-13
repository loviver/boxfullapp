import { AntdRegistry } from '@ant-design/nextjs-registry';

import Logo from "@/components/Misc/Logo";

import "@/app/globals.css";
import { Albert_Sans } from "next/font/google";

const albertSans = Albert_Sans({
  subsets: ['latin']
});

const Layout = ({ children }) => {
    return (
        <div className={albertSans.className}>
            <div className="bg-[#fff] w-full h-[80px] flex flex-row text-black items-center border-b gap-2 px-4">
                <div className="border-r-2 pr-6">
                    <Logo/>
                </div>
            </div>
            <div>
                <AntdRegistry>{children}</AntdRegistry>
            </div>
        </div>
    );
}

export default Layout