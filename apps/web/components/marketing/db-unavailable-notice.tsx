export function DbUnavailableNotice() {
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <p className="font-medium">Base de datos no disponible</p>
      <p className="mt-1 text-amber-800/90">
        Inicie PostgreSQL con{' '}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
          docker compose up -d postgres
        </code>{' '}
        y vuelva a cargar la página.
      </p>
    </div>
  );
}
