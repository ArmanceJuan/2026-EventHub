import { useDashboardData } from "./use-dashboard-data.hook";

export function AnalyticsDashboard() {
  const { data, status, error } = useDashboardData();

  if (status === "loading") {
    return <div>Chargement des statistiques...</div>;
  }

  if (status === "error") {
    return <div className="error">Erreur : {error}</div>;
  }

  if (!data.length) {
    return (
      <div className="card">
        <h2 className="title">Dashboard Analytics</h2>
        <p className="subtitle">
          Aucune donnée pour le moment. Visite des pages événement pour générer
          des statistiques.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="title">Dashboard Analytics</h2>
      <p className="subtitle">Pages événement les plus consultées</p>

      <table className="table">
        <thead>
          <tr>
            <th>Page</th>
            <th>Nombre de vues</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              <td>{row._id}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
