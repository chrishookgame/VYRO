"use client";

export default function TestPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Prueba Input</h1>

      <input
        type="file"
        onChange={(e) => {
          console.log(e.target.files);
          alert(
            e.target.files?.length
              ? e.target.files[0].name
              : "NO FILE"
          );
        }}
      />
    </main>
  );
}