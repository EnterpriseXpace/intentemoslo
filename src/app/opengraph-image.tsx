import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Intentémoslo de Nuevo - Diagnóstico Relacional'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    // Font loading (optional, using system fonts for simplicity and speed in this iteration)
    // In a real production setup, we might load the specific font file.

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #E5E7EB',
                        borderRadius: '24px',
                        padding: '60px 80px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        background: 'white',
                    }}
                >
                    {/* Logo / Heart */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#8CC63F"
                            width="80"
                            height="80"
                        >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    </div>

                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 900,
                            color: '#1a1a1a',
                            marginBottom: '16px',
                            letterSpacing: '-0.02em',
                            textAlign: 'center',
                        }}
                    >
                        Intentémoslo de Nuevo
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            color: '#666',
                            textAlign: 'center',
                            maxWidth: '800px',
                            lineHeight: 1.4,
                        }}
                    >
                        Diagnóstico relacional basado en ciencia.<br />
                        Sin juicios. Sin presión. Solo claridad.
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 40, color: '#8CC63F', fontSize: 24, fontWeight: 600 }}>
                    intentemoslo.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
