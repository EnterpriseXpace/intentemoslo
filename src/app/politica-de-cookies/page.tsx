"use client";

import { LegalLayout } from "@/components/layout/LegalLayout";

export default function CookiesPage() {
    return (
        <LegalLayout title="Política de Cookies Internacional" lastUpdated="Febrero 2026">
            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Uso de Cookies</h3>
            <p className="mb-4">
                Utilizamos cookies para garantizar el funcionamiento correcto de la plataforma y mejorar la experiencia del usuario.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Tipos de Cookies</h3>

            <h4 className="font-bold text-white mt-6 mb-2">Cookies Esenciales</h4>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Funcionamiento técnico del diagnóstico.</li>
                <li>Mantenimiento de sesión.</li>
            </ul>

            <h4 className="font-bold text-white mt-6 mb-2">Cookies Analíticas (si aplica)</h4>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Análisis anónimo de uso para mejoras del servicio.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Cookies de Terceros</h3>
            <p className="mb-4">
                Servicios como Stripe pueden instalar cookies propias para garantizar la seguridad de las transacciones.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Gestión de Cookies</h3>
            <p className="mb-4">
                El usuario puede configurar su navegador para rechazar cookies.
                La desactivación de cookies esenciales puede afectar al funcionamiento del servicio.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">5. Consentimiento</h3>
            <p className="mb-4">
                Al continuar navegando, el usuario acepta el uso de cookies conforme a esta política.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">6. Uso con fines estadísticos</h3>
            <p className="mb-4">
                La plataforma utiliza herramientas de analítica que recopilan información de forma agregada y anonimizada, con el único objetivo de comprender el uso general del servicio (por ejemplo, país de origen, tipo de dispositivo o navegación dentro del sitio).
            </p>
            <p className="mb-4">
                Esta información no permite identificar a personas concretas y no se utiliza para publicidad personalizada ni seguimiento individual.
            </p>
        </LegalLayout>
    );
}
