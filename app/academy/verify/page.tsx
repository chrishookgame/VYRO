import { CertificateVerifier } from "@/components/academy/CertificateVerifier";

export default function AcademyVerifyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl p-6 md:p-10">
      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          VYRO Academy
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Verificación de certificados
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Comprueba la autenticidad de un certificado emitido por
          VYRO Academy utilizando su identificador único.
        </p>
      </header>

      <CertificateVerifier />
    </main>
  );
}
