"use client";

import { LegalLayout } from "@/components/layout/LegalLayout";

export default function TermsPage() {
    return (
        <LegalLayout title="Términos y Condiciones de Uso" lastUpdated="Febrero 2026">
            <p className="lead font-medium text-lg mb-8">
                (Versión internacional – español)
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Naturaleza del Servicio</h3>
            <p className="mb-4">
                Intentémoslo de Nuevo es una plataforma digital que ofrece herramientas de reflexión, autoconocimiento y análisis relacional basadas en cuestionarios estructurados y modelos de evaluación no clínicos.
            </p>
            <p className="mb-4">
                El servicio tiene finalidad informativa y orientativa, y está diseñado para ayudar a las personas a ordenar percepciones, identificar patrones relacionales y ganar claridad personal.
            </p>

            <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 my-6">
                <p className="font-bold text-amber-200 mb-2">⚠️ Advertencia legal explícita:</p>
                <p className="text-gray-300 mb-2">El servicio:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>No constituye terapia psicológica.</li>
                    <li>No realiza diagnósticos médicos o clínicos.</li>
                    <li>No sustituye la intervención de profesionales de la salud mental, mediación familiar o asesoría legal.</li>
                </ul>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Uso del Servicio</h3>
            <p className="mb-4">El usuario se compromete a:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Proporcionar información veraz.</li>
                <li>Utilizar los resultados de forma responsable y personal.</li>
                <li>No utilizar el servicio con fines fraudulentos, automatizados o comerciales no autorizados.</li>
            </ul>
            <p className="mb-4">
                La plataforma se reserva el derecho de suspender el acceso ante usos indebidos.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Resultados y Limitación de Responsabilidad</h3>
            <p className="mb-4">Los resultados:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>No son determinantes ni concluyentes.</li>
                <li>No predicen comportamientos futuros.</li>
                <li>No deben ser utilizados como única base para decisiones personales, familiares, legales o médicas.</li>
            </ul>
            <p className="mb-4">
                La interpretación y uso de los resultados es responsabilidad exclusiva del usuario.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Propiedad Intelectual</h3>
            <p className="mb-4">
                Todo el contenido, lógica, estructura, textos y diseño pertenecen a Intentémoslo de Nuevo.
                Queda prohibida su reproducción o uso no autorizado.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">5. Legislación Aplicable</h3>
            <p className="mb-4">Este servicio se rige por:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Normativa europea (RGPD) para usuarios de la UE.</li>
                <li>Legislación local de protección de datos aplicable según el país del usuario en Latinoamérica.</li>
            </ul>
        </LegalLayout>
    );
}
