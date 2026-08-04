"use client";

import {
  Download,
  File,
  FilePlus2,
  FolderOpen,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type ProjectFile = {
  id: string;
  file_name: string;
  file_size: string | null;
  storage_path: string | null;
  created_at: string;
};

type ProjectFilesProps = {
  projectId: string;
};

const BUCKET_NAME = "project-files";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 KB";
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
}

export default function ProjectFiles({
  projectId,
}: ProjectFilesProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [busyFileId, setBusyFileId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setFiles([]);
      setLoading(false);
      setError(
        "Debes iniciar sesión para ver los archivos.",
      );
      return;
    }

    const { data, error: filesError } = await supabase
      .from("project_files")
      .select(
        "id, file_name, file_size, storage_path, created_at",
      )
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (filesError) {
      console.error(
        "VYRO could not load project files:",
        filesError,
      );

      setFiles([]);
      setLoading(false);
      setError(
        "No fue posible cargar los archivos.",
      );
      return;
    }

    setFiles((data ?? []) as ProjectFile[]);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  async function uploadFile(
    file: globalThis.File,
  ): Promise<boolean> {
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `El archivo ${file.name} supera el límite de 10 MB.`,
      );
      return false;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(
        "Debes iniciar sesión para subir archivos.",
      );
      return false;
    }

    const safeName = sanitizeFileName(file.name);

    const storagePath =
      `${user.id}/${projectId}/${Date.now()}-${safeName}`;

    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "VYRO project file upload failed:",
        uploadError,
      );

      setError(
        `No fue posible subir ${file.name}: ${uploadError.message}`,
      );

      return false;
    }

    const { data, error: insertError } = await supabase
      .from("project_files")
      .insert({
        project_id: projectId,
        user_id: user.id,
        file_name: file.name,
        file_size: formatFileSize(file.size),
        storage_path: storagePath,
      })
      .select(
        "id, file_name, file_size, storage_path, created_at",
      )
      .single();

    if (insertError) {
      console.error(
        "VYRO project file registration failed:",
        insertError,
      );

      await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath]);

      setError(
        `El archivo ${file.name} se subió, pero no pudo registrarse: ${insertError.message}`,
      );

      return false;
    }

    setFiles((currentFiles) => [
      data as ProjectFile,
      ...currentFiles,
    ]);

    return true;
  }

  async function handleFilesSelected(
    selectedFiles: globalThis.File[],
  ) {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    let successfulUploads = 0;

    for (const file of selectedFiles) {
      const uploaded = await uploadFile(file);

      if (uploaded) {
        successfulUploads += 1;
      }
    }

    setUploading(false);

    if (successfulUploads === selectedFiles.length) {
      setMessage(
        selectedFiles.length === 1
          ? "Archivo subido correctamente."
          : `${successfulUploads} archivos subidos correctamente.`,
      );
      return;
    }

    if (successfulUploads > 0) {
      setMessage(
        `${successfulUploads} de ${selectedFiles.length} archivos fueron subidos.`,
      );
    }
  }

  async function downloadFile(
    projectFile: ProjectFile,
  ) {
    if (!projectFile.storage_path) {
      setError(
        "Este archivo no tiene una ruta de almacenamiento.",
      );
      return;
    }

    setBusyFileId(projectFile.id);
    setError("");
    setMessage("");

    const { data, error: downloadError } =
      await supabase.storage
        .from(BUCKET_NAME)
        .download(projectFile.storage_path);

    setBusyFileId(null);

    if (downloadError || !data) {
      console.error(
        "VYRO project file download failed:",
        downloadError,
      );

      setError(
        "No fue posible descargar el archivo.",
      );
      return;
    }

    const objectUrl = URL.createObjectURL(data);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = projectFile.file_name;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(objectUrl);
  }

  async function deleteFile(
    projectFile: ProjectFile,
  ) {
    setBusyFileId(projectFile.id);
    setError("");
    setMessage("");

    if (projectFile.storage_path) {
      const { error: storageError } =
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([projectFile.storage_path]);

      if (storageError) {
        console.error(
          "VYRO project storage deletion failed:",
          storageError,
        );

        setBusyFileId(null);
        setError(
          "No fue posible eliminar el archivo del almacenamiento.",
        );
        return;
      }
    }

    const { error: databaseError } = await supabase
      .from("project_files")
      .delete()
      .eq("id", projectFile.id);

    setBusyFileId(null);

    if (databaseError) {
      console.error(
        "VYRO project file record deletion failed:",
        databaseError,
      );

      setError(
        "El archivo fue eliminado del almacenamiento, pero no del registro.",
      );
      return;
    }

    setFiles((currentFiles) =>
      currentFiles.filter(
        (file) => file.id !== projectFile.id,
      ),
    );

    setMessage(
      "Archivo eliminado correctamente.",
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <input
        ref={inputRef}
        hidden
        type="file"
        multiple
        onChange={(event) => {
          const selectedFiles = Array.from(
            event.target.files ?? [],
          );

          event.target.value = "";

          void handleFilesSelected(selectedFiles);
        }}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
            <FolderOpen
              className="text-cyan-400"
              size={24}
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              Project Files
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Archivos del proyecto
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            inputRef.current?.click();
          }}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <LoaderCircle
              className="animate-spin"
              size={19}
            />
          ) : (
            <Upload size={19} />
          )}

          {uploading
            ? "Subiendo..."
            : "Agregar archivos"}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Tamaño máximo por archivo: 10 MB.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      {message ? (
        <p
          aria-live="polite"
          className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200"
        >
          {message}
        </p>
      ) : null}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoaderCircle
            className="animate-spin text-cyan-400"
            size={34}
          />
        </div>
      ) : files.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-cyan-500/20 bg-white/[0.02] p-8 text-center">
          <FilePlus2
            className="mx-auto text-cyan-400"
            size={38}
          />

          <h3 className="mt-4 text-lg font-black text-white">
            No hay archivos todavía
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Agrega documentos, imágenes, videos o recursos relacionados
            con este proyecto.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-3">
          {files.map((projectFile) => {
            const isBusy =
              busyFileId === projectFile.id;

            return (
              <article
                key={projectFile.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <File
                    className="text-cyan-400"
                    size={21}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {projectFile.file_name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {projectFile.file_size ||
                      "Tamaño desconocido"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void downloadFile(projectFile);
                  }}
                  disabled={isBusy}
                  className="shrink-0 text-gray-400 transition hover:text-cyan-400 disabled:opacity-50"
                  aria-label={`Descargar archivo ${projectFile.file_name}`}
                >
                  {isBusy ? (
                    <LoaderCircle
                      className="animate-spin"
                      size={19}
                    />
                  ) : (
                    <Download size={19} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void deleteFile(projectFile);
                  }}
                  disabled={isBusy}
                  className="shrink-0 text-gray-500 transition hover:text-red-400 disabled:opacity-50"
                  aria-label={`Eliminar archivo ${projectFile.file_name}`}
                >
                  <Trash2 size={19} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}