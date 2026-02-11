"use client";

import { LegalLayout } from "@/components/layout/LegalLayout";

export default function PrivacyPage() {
    return (
        <LegalLayout title="Política de Privacidad Internacional" lastUpdated="Febrero 2026">
            <p className="lead font-medium text-lg mb-8">
                (RGPD + LATAM compatible)
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Responsable del Tratamiento</h3>
            <p className="mb-4">
                <strong>Responsable:</strong> Intentémoslo de Nuevo<br />
                <strong>Finalidad:</strong> Prestación de servicios digitales de diagnóstico relacional orientativo.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Datos que Recopilamos</h3>
            <p className="mb-4">Solo recopilamos los datos estrictamente necesarios:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Respuestas al cuestionario (tratadas de forma anonimizada).</li>
                <li>Correo electrónico (solo en caso de compra o envío de resultados).</li>
                <li>Información técnica mínima para el funcionamiento de la plataforma.</li>
            </ul>

            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 my-6">
                <p className="font-bold text-red-200 mb-2">🚫 No recopilamos ni almacenamos:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>Datos médicos o clínicos.</li>
                    <li>Información financiera.</li>
                    <li>Datos sensibles protegidos por ley.</li>
                </ul>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Base Legal del Tratamiento</h3>
            <p className="mb-4">El tratamiento se fundamenta en:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Consentimiento explícito del usuario.</li>
                <li>Ejecución del servicio solicitado.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Uso de la Información</h3>
            <p className="mb-4">Los datos se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Generar resultados personalizados.</li>
                <li>Enviar el acceso al informe.</li>
                <li>Mejorar el servicio de forma estadística y anonimizada.</li>
                <li>Analizar de forma agregada el comportamiento general de los usuarios para mejorar el producto, la comunicación y la toma de decisiones estratégicas, sin identificar individualmente a los usuarios.</li>
                <li>No se utilizan con fines publicitarios sin consentimiento.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">5. Proveedores Externos</h3>
            <p className="mb-4">
                Los pagos son gestionados por Stripe, proveedor certificado y compatible con RGPD.
                No almacenamos datos de tarjetas ni información bancaria.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">6. Derechos del Usuario (UE y LATAM)</h3>
            <p className="mb-4">El usuario puede ejercer:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Derecho de acceso.</li>
                <li>Rectificación.</li>
                <li>Cancelación o eliminación.</li>
                <li>Oposición o limitación del tratamiento.</li>
            </ul>
            <p className="mb-4">
                Estos derechos se pueden ejercer mediante el formulario Contáctanos.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">7. Conservación de Datos</h3>
            <p className="mb-4">
                Los datos se conservan solo el tiempo necesario para cumplir la finalidad del servicio o hasta que el usuario solicite su eliminación.
            </p>
        </LegalLayout>
    );
}
