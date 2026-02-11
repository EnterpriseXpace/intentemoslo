import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { RingChart } from "@/components/ui/RingChart";
import { Header } from "@/components/layout/Header";

export default function ComponentsCheck() {
    return (
        <div className="min-h-screen bg-[#faf9f6] pb-20">
            <Header />

            <main className="mx-auto max-w-4xl p-10 space-y-12">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Identity Visual Components</h2>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold">Buttons</h3>
                        <div className="flex gap-4">
                            <Button>Primary Button</Button>
                            <Button variant="ghost">Ghost Button</Button>
                        </div>

                        <h3 className="font-semibold">Progress Bar</h3>
                        <ProgressBar value={40} className="w-full max-w-md" />

                        <h3 className="font-semibold">Radio Cards</h3>
                        <div className="flex flex-col gap-3 max-w-md">
                            <RadioCard label="Nunca" name="test" />
                            <RadioCard label="Raramente" name="test" defaultChecked />
                            <RadioCard label="A veces" name="test" />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Dashboard Components</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-4">Glass Card Title</h3>
                            <p className="text-slate-600">This is a glass card extracted from the dashboard view.</p>
                        </GlassCard>

                        <div className="bg-white p-6 rounded-xl border">
                            <h3 className="text-xl font-bold mb-4">Ring Charts</h3>
                            <div className="space-y-4">
                                <RingChart value={60} label="Comunicación" subLabel="Nivel Moderado" />
                                <RingChart value={35} label="Intimidad" subLabel="Prioridad Crítica" color="#a8d672" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
