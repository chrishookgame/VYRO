import type {
  AcademyCertificate,
} from "@/lib/academy";

export function exportAcademyCertificatePdf(
  certificate: AcademyCertificate,
) {
  const popup = window.open(
    "",
    "_blank",
    "width=900,height=700",
  );

  if (!popup) {
    return false;
  }

  popup.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <title>Certificado VYRO Academy</title>

        <style>
          body{
            font-family:Arial,sans-serif;
            padding:60px;
            color:#222;
          }

          h1{
            color:#5b21b6;
          }

          .card{
            border:2px solid #5b21b6;
            border-radius:16px;
            padding:40px;
          }

          table{
            margin-top:30px;
            border-collapse:collapse;
          }

          td{
            padding:8px 18px;
          }
        </style>
      </head>

      <body>

        <div class="card">

          <h1>VYRO Academy</h1>

          <h2>Certificado de Finalización</h2>

          <p>
            Se certifica que
            <strong>${certificate.studentName}</strong>
          </p>

          <table>

            <tr>

              <td>Curso</td>

              <td>${certificate.courseId}</td>

            </tr>

            <tr>

              <td>Resultado</td>

              <td>${certificate.percentage}%</td>

            </tr>

            <tr>

              <td>Fecha</td>

              <td>${new Date(
                certificate.issuedAt,
              ).toLocaleDateString("es-CL")}</td>

            </tr>

            <tr>

              <td>ID</td>

              <td>${certificate.id}</td>

            </tr>

          </table>

        </div>

        <script>

          window.onload = () => {

            window.print();

          };

        </script>

      </body>

    </html>
  `);

  popup.document.close();

  return true;
}
