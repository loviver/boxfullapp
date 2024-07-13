'use client'

import FormOrden from "./components/form";

function Page() {
    return (
        <main className="lg:w-[60%] flex-col mx-auto my-5">
            <div className="my-10 lg:px-0 px-5">
                <div className="text-2xl font-[600] text-[#4D5568]">Crea una orden</div>
                <div className="text-[#7682A0]">
                    Dale una ventaja competitiva a tu negocio con entregas el mismo día (Área Metropolitana) y el día siguiente a nivel nacional.
                </div>
            </div>

            <div className="rounded-[10px] bg-[#FFFFFF] shadow-lg border px-10 py-12 w-full">
                <FormOrden />
            </div>
        </main>
    );
};

export default Page;